import Button from '@/components/buttons/Button';
import {
  IPage,
  IRole,
  IUserSummary,
  IWebsite
} from '@/lib/interfaces/interfaces';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState
} from 'react';
import PageForm from './PageForm';
import client from '@/lib/mongo/initMongoClient';
import { ENUM_COLLECTIONS } from '@/lib/mongo/interfaces';
import { sortArray } from '@/lib/utils/utils';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import Templates from '../../admin/ressources/[id]/components/Templates';

type Props = {
  initialPage: IPage;
  onUpdateWebsite: Dispatch<SetStateAction<IWebsite>>;
  user: IUserSummary;
};
function PageBuilder({ initialPage, onUpdateWebsite, user }: Props) {
  const [page, setPage] = useState(initialPage);
  const [selectedTab, setSelectedTab] = useState('config');
  const [roles, setRoles] = useState<IRole[]>([]);

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    if (!page.organizationId) return;
    client
      .list<IRole>(ENUM_COLLECTIONS.ROLES, {
        organizationId: page.organizationId
      })
      .then(({ data }) => {
        if (!data) return;
        setRoles(sortArray(data, 'name'));
      });
  }, [page.organizationId]);

  const handleSubmit = (updatedPage: IPage) => {
    onUpdateWebsite((prev) => {
      return {
        ...prev,
        pages: prev.pages.map((p) => {
          if (p._id === updatedPage._id) {
            return updatedPage;
          }
          return p;
        })
      };
    });
  };

  const handleChangeRole = (state: CheckedState, roleId: string) => {
    if (typeof state !== 'boolean') return;
    const updatedPage = {
      ...page,
      roles: state
        ? [...page.roles, roleId]
        : page.roles.filter((role) => role !== roleId)
    };
    setPage(updatedPage);
    onUpdateWebsite((prev) => {
      return {
        ...prev,
        pages: prev.pages.map((p) => {
          if (p._id === updatedPage._id) {
            return updatedPage;
          }
          if (p.subPages.length) {
            return {
              ...p,
              subPages: p.subPages.map((sp) => {
                if (sp._id === updatedPage._id) {
                  return updatedPage;
                }
                return sp;
              })
            };
          }
          return p;
        })
      };
    });
  };
  const handleUpdatePage = useCallback(
    (updatedPage: IPage) => {
      setPage(updatedPage);
      onUpdateWebsite((prev) => {
        return {
          ...prev,
          pages: prev.pages.map((p) => {
            if (p._id === updatedPage._id) {
              return updatedPage;
            }
            if (p.subPages.length) {
              return {
                ...p,
                subPages: p.subPages.map((sp) => {
                  if (sp._id === updatedPage._id) {
                    return updatedPage;
                  }
                  return sp;
                })
              };
            }
            return p;
          })
        };
      });
    },
    [onUpdateWebsite]
  );
  return (
    <div className='flex-1'>
      <h2>{page.name}</h2>
      <h1>PageBuilder</h1>
      <div className='flex flex-1'>
        <ul>
          <li>
            <Button
              className={`${
                selectedTab === 'config' ? 'bg-black text-white' : ''
              }`}
              onClick={() => setSelectedTab('config')}>
              Page config
            </Button>
          </li>
          <li>
            <Button
              className={`${
                selectedTab === 'design' ? 'bg-black text-white' : ''
              }`}
              onClick={() => setSelectedTab('design')}>
              Design
            </Button>
          </li>
          <li>
            <Button
              className={`${
                selectedTab === 'roles' ? 'bg-black text-white' : ''
              }`}
              onClick={() => setSelectedTab('roles')}>
              Roles
            </Button>
          </li>
        </ul>
        <div className='flex-1'>
          {selectedTab === 'config' && (
            <PageForm
              initialPage={page}
              organizationId={page.organizationId}
              onSubmit={handleSubmit}
              websiteId={page.websiteId}
            />
          )}
          {selectedTab === 'roles' ? (
            <FormField>
              <FormLabel required>{'labels.roles'}</FormLabel>
              <ul>
                {roles.map((role) => (
                  <li key={role._id}>
                    <FormField className='flex-row items-center'>
                      <Checkbox
                        onCheckedChange={(state) =>
                          handleChangeRole(state, role._id)
                        }
                        value={role._id}
                        checked={page.roles.includes(role._id)}
                      />
                      <FormLabel className='mb-0'>{role.name}</FormLabel>
                    </FormField>
                  </li>
                ))}
              </ul>
            </FormField>
          ) : null}
          {selectedTab === 'design' ? (
            <Templates
              page={page}
              organizationId={page.organizationId}
              user={user}
              onUpdatePage={handleUpdatePage}
            />
          ) : null}
        </div>
      </div>

      {/* {selectedTab === 'design' ?
      <TemplateBuilderProvider initialTemplate={null} onSave={} user={user}>
        <TemplateBuilder />
      </TemplateBuilderProvider>
    : null
    } */}
    </div>
  );
}
export default PageBuilder;
