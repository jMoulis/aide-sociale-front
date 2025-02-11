import { IEmployee } from '@/lib/interfaces/interfaces';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { useMemo } from 'react';
import CreateEmployee from './CreateEmployee';
import { nanoid } from 'nanoid';
import MongoSearchProvider from '@/lib/mongo/MongoSearchContext/MongoSearchContext';
import Searchbar from '@/lib/mongo/MongoSearchContext/components/Searchbar';
import Facets from '@/lib/mongo/MongoSearchContext/components/Facets/Facets';
import Hits from '@/lib/mongo/MongoSearchContext/components/Hits/Hits';
import CustomHits from './CustomHits';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faTimes
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import CustomFacetListItem from './CustomFacetListItem';

type Props = {
  structureId: string;
  organizationId: string;
};
function EmployeesList({ structureId, organizationId }: Props) {
  const t = useTranslations('GlobalSection.actions');

  const defaultEmployee: IEmployee = {
    _id: nanoid(),
    firstName: '',
    lastName: '',
    roles: [],
    imageUrl: null,
    structureId,
    createdAt: new Date(),
    organizationId
  };

  const facetsConfig = useMemo(
    () => ({
      facets: {
        genderFacet: { type: 'string', path: 'gender' }
      }
    }),
    []
  );
  return (
    <>
      <CreateEmployee initialEmployee={defaultEmployee} />
      <MongoSearchProvider<IEmployee>
        collection={ENUM_COLLECTIONS.USERS}
        searchFilters={{ structureId }}>
        <div className='flex space-x-2'>
          <div className='w-1/4'>
            <Facets
              index='facet-index'
              config={facetsConfig}
              clearButton={t('clearFilters')}
              FacetListItem={(props: any) => <CustomFacetListItem {...props} />}
            />
          </div>
          <div>
            <Searchbar
              index='users-index'
              clearTextButton={<FontAwesomeIcon icon={faTimes} />}
              searchPlaceholder={t('search')}
              searchTextButton={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            />
            <Hits index='users-index'>
              <CustomHits structureId={structureId} />
            </Hits>
          </div>
        </div>
      </MongoSearchProvider>
    </>
  );
}
export default EmployeesList;
