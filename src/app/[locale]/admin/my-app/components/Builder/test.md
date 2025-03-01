Both `Overlapping placements with male filters (booked institutions)`and `Overlapping placements with female filters`don't pass.


Ok here is the query code
```typescript
    function buildDynamicQueryRecursive(
      filters: Record<string, any>,
      configs: FieldConfig[],
      prefix: string = 'data'
    ): any {
      const query: any = {};
      for (const field of configs) {
        const value = filters[field.key];
        if (value === undefined || value === null) continue;

        // Build the key (using dot notation if prefix is provided)
        const queryKey = prefix ? `${prefix}.${field.key}` : field.key;

        switch (field.type) {
          case 'boolean':
          case 'string':
          case 'number':
          case 'date':
            // For simple types, we assume an equality check (or you could extend this)
            query[queryKey] = value;
            break;
          case 'object':
            // If the field is an object and a value was provided, recursively build the query
            if (typeof value === 'object') {
              const nestedQuery = buildDynamicQueryRecursive(
                value,
                field.fields || [],
                ''
              );
              // Merge the nested query keys with the current key as a prefix.
              for (const nestedKey in nestedQuery) {
                query[`${queryKey}.${nestedKey}`] = nestedQuery[nestedKey];
              }
            }
            break;
          case 'array':
            // For arrays, if we have a description for the elements we could handle it differently.
            // For now, assume an array of simple types and use $in.
            if (Array.isArray(value)) {
              query[queryKey] = { $in: value };
            } else {
              query[queryKey] = value;
            }
            break;
          default:
            query[queryKey] = value;
        }
      }
      return query;
    }

    const testScenariosWithFilters = [
      {
        description: 'Before placements with male filters',
        from: new Date('2025-02-27T00:00:00Z'),
        to: new Date('2025-02-28T00:00:00Z'),
        userFilters: {
          gender: 'male',
          age: ['0-3', '3-6'],
          hcp: true
        },
        expected: ['Institution A', 'Institution B'],
        expectedSize: 2
      },
      {
        description: 'After placements with female filters',
        from: new Date('2025-03-26T00:00:00Z'),
        to: new Date('2025-03-27T00:00:00Z'),
        userFilters: {
          gender: 'female',
          age: ['6-9'],
          hcp: false
        },
        expected: ['Institution C', 'Institution D'],
        expectedSize: 2
      },
      {
        description:
          'Overlapping placements with male filters (booked institutions)',
        from: new Date('2025-03-06T00:00:00Z'),
        to: new Date('2025-03-07T00:00:00Z'),
        userFilters: {
          gender: 'male',
          age: ['0-3', '3-6'],
          hcp: true
        },
        expected: [],
        expectedSize: 0
      },
      {
        description: 'Overlapping placements with female filters',
        from: new Date('2025-03-10T00:00:00Z'),
        to: new Date('2025-03-11T00:00:00Z'),
        userFilters: {
          gender: 'female',
          age: ['6-9'],
          hcp: false
        },
        // In this range, Institution C is booked (by placement p4),
        // so only Institution D remains available.
        expected: ['Institution D'],
        expectedSize: 1
      },
      {
        description: 'Before placements with non-matching filters',
        from: new Date('2025-02-27T00:00:00Z'),
        to: new Date('2025-02-28T00:00:00Z'),
        userFilters: {
          gender: 'male',
          age: ['9-12'],
          hcp: false
        },
        expected: [],
        expectedSize: 0
      }
    ];
    const responses = await Promise.all(
      testScenariosWithFilters.map(async (searchedData) => {
        const response: any = {
          title: searchedData.description,
          expected: searchedData.expected,
          expectedSize: searchedData.expectedSize
        };
        const filters = [
          ...Object.entries(
            Object.keys(
              buildDynamicQueryRecursive(searchedData.userFilters, fieldConfigs)
            ).reduce((acc, key) => {
              acc[`${key}`] = buildDynamicQueryRecursive(
                // don't need to prefix, we do it in the previous step
                searchedData.userFilters,
                fieldConfigs,
                'data'
              )[key];
              return acc;
            }, {} as Record<string, any>)
          ).map(([k, v]) => ({ [k]: v }))
        ];

        const query: IQuery = {
          method: 'search',
          collection: 'etablissements' as ENUM_COLLECTIONS,
          filters: {},
          aggregateOptions: [
            {
              $lookup: {
                from: 'Yjk0ZjAz_placements',
                localField: '_id',
                foreignField: 'data.etablissement',
                as: 'placements'
              }
            },
            {
              $match: {
                $and: [
                  {
                    $expr: {
                      $eq: [
                        {
                          $size: {
                            $filter: {
                              input: '$placements',
                              as: 'pl',
                              cond: {
                                $and: [
                                  {
                                    $lte: [
                                      '$$pl.data.periode_placement.from',
                                      searchedData.to
                                    ]
                                  },
                                  {
                                    $gte: [
                                      '$$pl.data.periode_placement.to',
                                      searchedData.from
                                    ]
                                  }
                                ]
                              }
                            }
                          }
                        },
                        0
                      ]
                    }
                  },
                  // Spread in dynamic filters (assuming they already have the 'data.' prefix)
                  ...filters
                ]
              }
            },
            { $project: { _id: 1, data: 1 } }
          ]
        };

        const availableInstitutionsPayload = await getMethod(query, {}, {});
        const availableInstitutions = availableInstitutionsPayload?.data || [];
        response['institutions'] = availableInstitutions.map(
          (i: FormType) => i.data.name
        );
        response['matchSize'] =
          availableInstitutions?.length === searchedData.expectedSize;
        return response;
      })
    );
    console.log(responses);
```

The output:
```json
[
    {
        "title": "Before placements with male filters",
        "expected": [
            "Institution A",
            "Institution B"
        ],
        "expectedSize": 2,
        "institutions": [
            "Institution A",
            "Institution B"
        ],
        "matchSize": true
    },
    {
        "title": "After placements with female filters",
        "expected": [
            "Institution C",
            "Institution D"
        ],
        "expectedSize": 2,
        "institutions": [
            "Institution C",
            "Institution D"
        ],
        "matchSize": true
    },
    {
        "title": "Overlapping placements with male filters (booked institutions)",
        "expected": [],
        "expectedSize": 0,
        "institutions": [
            "Institution A",
            "Institution B"
        ],
        "matchSize": false
    },
    {
        "title": "Overlapping placements with female filters",
        "expected": [
            "Institution D"
        ],
        "expectedSize": 1,
        "institutions": [
            "Institution C",
            "Institution D"
        ],
        "matchSize": false
    },
    {
        "title": "Before placements with non-matching filters",
        "expected": [],
        "expectedSize": 0,
        "institutions": [],
        "matchSize": true
    }
]
```