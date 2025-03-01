'use client';

import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import Link from 'next/link';
import { ENUM_APP_ROUTES } from '@/lib/interfaces/enums';

import { useTranslations } from 'next-intl';
import Button from '@/components/buttons/Button';
import { executeQueryChain } from '../app/utils/sharedUtils';
import { IQuery } from '@/lib/interfaces/interfaces';
import { FormType } from '../admin/my-app/components/Builder/Components/FormContext';
import client from '@/lib/mongo/initMongoClient';

function Header() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const t = useTranslations('GlobalSection');

  const handleSignout = async () => {
    await signOut({
      redirectUrl: '/sign-in'
    });
  };

  const handleTestQuery = async () => {
    // function buildDynamicQueryRecursive(
    //   filters: Record<string, any>,
    //   configs: FieldConfig[],
    //   prefix: string = 'data'
    // ): any {
    //   const query: any = {};
    //   for (const field of configs) {
    //     const value = filters[field.key];
    //     if (value === undefined || value === null) continue;

    //     // Build the key (using dot notation if prefix is provided)
    //     const queryKey = prefix ? `${prefix}.${field.key}` : field.key;

    //     switch (field.type) {
    //       case 'boolean':
    //       case 'string':
    //       case 'number':
    //       case 'date':
    //         // For simple types, we assume an equality check (or you could extend this)
    //         query[queryKey] = value;
    //         break;
    //       case 'object':
    //         // If the field is an object and a value was provided, recursively build the query
    //         if (typeof value === 'object') {
    //           const nestedQuery = buildDynamicQueryRecursive(
    //             value,
    //             field.fields || [],
    //             ''
    //           );
    //           // Merge the nested query keys with the current key as a prefix.
    //           for (const nestedKey in nestedQuery) {
    //             query[`${queryKey}.${nestedKey}`] = nestedQuery[nestedKey];
    //           }
    //         }
    //         break;
    //       case 'array':
    //         // For arrays, if we have a description for the elements we could handle it differently.
    //         // For now, assume an array of simple types and use $in.
    //         if (Array.isArray(value)) {
    //           query[queryKey] = { $in: value };
    //         } else {
    //           query[queryKey] = value;
    //         }
    //         break;
    //       default:
    //         query[queryKey] = value;
    //     }
    //   }
    //   return query;
    // }

    const testScenariosWithFilters = [
      {
        title: 'Scenario 1',
        description: 'Before placements with male filters',
        // User selects 27/02/2025 to 28/02/2025 locally → stored as:
        from: new Date('2025-02-26T23:00:00Z'),
        to: new Date('2025-02-27T23:00:00Z'),
        userFilters: {
          gender: 'male',
          age: ['0-3', '3-6'],
          hcp: true
        },
        // Only Institution A (etab1) and Institution B (etab2) are male and match the age/hcp filter.
        expected: ['Institution A', 'Institution B'],
        expectedSize: 2
      },
      {
        title: 'Scenario 2',
        description: 'After placements with female filters',
        // User selects 26/03/2025 to 27/03/2025 locally → stored as:
        from: new Date('2025-03-25T23:00:00Z'),
        to: new Date('2025-03-26T23:00:00Z'),
        userFilters: {
          gender: 'female',
          age: ['6-9'],
          hcp: false
        },
        // Both Institution C (etab3) and Institution D (etab4) are female and match.
        expected: ['Institution C', 'Institution D'],
        expectedSize: 2
      },
      {
        title: 'Scenario 3',
        description:
          'Overlapping placements with male filters (booked institutions)',
        // User selects 06/03/2025 to 07/03/2025 locally → stored as:
        from: new Date('2025-03-05T23:00:00Z'),
        to: new Date('2025-03-06T23:00:00Z'),
        userFilters: {
          gender: 'male',
          age: ['0-3', '3-6'],
          hcp: true
        },
        // At this time, p1 (Institution A) and p2 (Institution B) both overlap the search range,
        // so no male institution is available.
        expected: [],
        expectedSize: 0
      },
      {
        title: 'Scenario 4',
        description: 'Overlapping placements with female filters',
        // User selects 10/03/2025 to 11/03/2025 locally → stored as:
        from: new Date('2025-03-09T23:00:00Z'),
        to: new Date('2025-03-10T23:00:00Z'),
        userFilters: {
          gender: 'female',
          age: ['6-9'],
          hcp: false
        },
        // p4 books Institution C (etab3) from 2025-03-08T00:00:00Z to 2025-03-25T00:00:00Z,
        // so only Institution D (etab4) remains available.
        expected: ['Institution D'],
        expectedSize: 1
      },
      {
        title: 'Scenario 5',
        description: 'Before placements with non-matching filters',
        // User selects 27/02/2025 to 28/02/2025 locally → stored as:
        from: new Date('2025-02-26T23:00:00Z'),
        to: new Date('2025-02-27T23:00:00Z'),
        userFilters: {
          gender: 'male',
          age: ['9-12'],
          hcp: false
        },
        // Neither Institution A nor Institution B have "9-12" in their age range.
        expected: [],
        expectedSize: 0
      }
    ];
    const fakeJsonQueries = `[
    {
        "method": "list",
        "collection": "Yjk0ZjAz_placements",
        "filters": {
            "data.periode_placement.from": {
                "$lte": "{{:to}}"
            },
            "data.periode_placement.to": {
                "$gte": "{{:from}}"
            }
        },
        "output": {
            "name": "bookedIds",
            "operation": "map",
            "input": "{{:data}}",
            "mapper": "{{:current.data.etablissement}}"
        }
    },
    {
        "method": "list",
        "collection": "etablissements",
        "filters": {
            "_id": {
                "$nin": "{{:bookedIds}}"
            },
            "data.gender": "{{:userFilters.gender}}",
            "data.age": { "$in": "{{:userFilters.age}}"},
            "data.hcp": "{{:userFilters.hcp}}"
        },
        "output": {
            "name": "availableInstitutions"
        }
    }
]`;
    const responses = await Promise.all(
      testScenariosWithFilters.map(async (searchedData) => {
        const queries = JSON.parse(fakeJsonQueries) as IQuery[];
        // console.log(searchedData);
        const placementsPayload = await executeQueryChain(
          client,
          queries,
          searchedData,
          {}
        );

        const availableInstitutions =
          placementsPayload?.availableInstitutions?.data || [];

        return {
          title: searchedData.title,
          bookIds: placementsPayload?.bookedIds,
          matchSize: availableInstitutions.length === searchedData.expectedSize,
          expected: searchedData.expected,
          expectedSize: searchedData.expectedSize,
          scenario: searchedData,
          institutions: availableInstitutions.map((i: FormType) => i.data.name)
        };
      })
    );
    console.info(responses);
  };
  return (
    <header
      style={{
        gridArea: 'header',
        display: 'flex'
      }}>
      <Button onClick={handleTestQuery}>TestQuery</Button>
      <div className='flex justify-end flex-1 items-center px-2 bg-indigo-300'>
        <SignedIn>
          <Popover>
            <PopoverTrigger className='flex items-center' asChild>
              <button type='button'>
                {user?.imageUrl ? (
                  <Image
                    className='rounded-full'
                    src={user?.imageUrl}
                    alt='profile'
                    width={35}
                    height={35}
                    sizes='35px'
                  />
                ) : null}
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <div className='flex items-center'>
                {user?.imageUrl ? (
                  <Image
                    className='rounded-full m-2'
                    src={user?.imageUrl}
                    alt='profile'
                    width={35}
                    height={35}
                    sizes='35px'
                  />
                ) : null}
                <div className='flex flex-col'>
                  <div>
                    <span className='text-xs font-bold'>{user?.firstName}</span>
                    <span className='text-xs font-bold'>{user?.lastName}</span>
                  </div>
                  <span className='text-xs'>
                    {user?.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
              </div>
              <ul className='mb-3'>
                <li className='mb-2'>
                  <Link href={ENUM_APP_ROUTES.PROFILE}>{t('profile')}</Link>
                </li>
                <li className='mb-2'>
                  <Link href={ENUM_APP_ROUTES.APP}>{t('dashboard')}</Link>
                </li>
                <li className='mb-2'>
                  <Link href={ENUM_APP_ROUTES.MY_APP}>{t('myApp')}</Link>
                </li>
                <li>
                  <Link href={ENUM_APP_ROUTES.ADMIN_PAGE}>{t('admin')}</Link>
                </li>
              </ul>
              <Button onClick={handleSignout}>Déconnexion</Button>
            </PopoverContent>
          </Popover>
        </SignedIn>
        <SignedOut>
          <Link href={ENUM_APP_ROUTES.SIGN_IN}>Connexion</Link>
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
