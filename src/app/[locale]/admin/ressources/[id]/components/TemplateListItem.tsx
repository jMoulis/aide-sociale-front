import Avatar from '@/components/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  IFormTemplate,
  IMasterTemplate
} from '@/lib/TemplateBuilder/interfaces';
import { cn } from '@/lib/utils/shadcnUtils';
import {
  faLock,
  faUnlock
} from '@awesome.me/kit-8441d3fdf2/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';

type Props = {
  template: IFormTemplate;
  isEditable: boolean;
  masterTemplate: IMasterTemplate;
  onSelectTemplate: (template: IFormTemplate) => void;
};
function TemplateListItem({
  template,
  isEditable,
  masterTemplate,
  onSelectTemplate
}: Props) {
  return (
    <button className='h-fit' onClick={() => onSelectTemplate(template)}>
      <Card>
        <CardHeader>
          <CardTitle>
            <span>{template.title}</span>
            <span className='text-xs ml-1 text-slate-500'>{`(v-${template.version})`}</span>
            <FontAwesomeIcon icon={isEditable ? faUnlock : faLock} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col'>
            <span>{template.published && 'published'}</span>
            <span>
              {template.version === masterTemplate.latestVersion && 'latest'}
            </span>
            <span>
              {template.createdAt
                ? format(template.createdAt, 'dd/MM/yyyy')
                : ''}
            </span>
          </div>
          <div
            className={cn(
              'grid grid-cols-[40px,1fr] gap-2 items-center p-2 rounded-md cursor-pointer mb-1'
            )}>
            <Avatar
              src={template.createdBy?.imageUrl}
              alt={template.createdBy?.firstName || ''}
            />
            <span>{template.createdBy?.firstName}</span>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
export default TemplateListItem;
