import { useEffect, useState } from 'react';
import FormField from '@/components/form/FormField';
import FormLabel from '@/components/form/FormLabel';
import Input from '@/components/form/Input';
import { ElementConfigProps } from '../../../interfaces';
import Selectbox from '@/components/form/Selectbox';
import DeleteButton from '@/components/buttons/DeleteButton';
import { IPage, LinkAttributes } from '@/lib/interfaces/interfaces';
import SelectPages from './SelectPages';
// import { CheckedState } from '@radix-ui/react-checkbox';
// import { useDataset } from '../Dataset/useDataset';

const options = [
  {
    label: 'Lien (URL) - href',
    value: 'href',
    description:
      "Spécifie l'adresse du lien vers laquelle l'utilisateur sera redirigé.",
    mandatory: true
  },
  {
    label: "Cible d'ouverture - target",
    value: 'target',
    description:
      "Définit la manière dont le lien s'ouvrira (_self, _blank, _parent, _top).",
    mandatory: false
  },
  {
    label: 'Relation avec le document cible - rel',
    value: 'rel',
    description:
      'Spécifie la relation entre le document courant et la page liée (nofollow, noopener, noreferrer, etc.).',
    mandatory: false
  },
  {
    label: 'Téléchargement - download',
    value: 'download',
    description:
      "Indique que le fichier cible doit être téléchargé au lieu d'être ouvert.",
    mandatory: false
  },
  {
    label: 'Type MIME - type',
    value: 'type',
    description: 'Spécifie le type MIME du document lié (ex: application/pdf).',
    mandatory: false
  },
  {
    label: 'Langue du document lié - hreflang',
    value: 'hreflang',
    description:
      'Indique la langue du document cible pour aider les moteurs de recherche.',
    mandatory: false
  },
  {
    label: 'Suivi des clics - ping',
    value: 'ping',
    description:
      'Envoie une requête POST aux URL spécifiées lorsque le lien est cliqué (utilisé pour le tracking).',
    mandatory: false
  },
  {
    label: 'Politique de référence - referrerpolicy',
    value: 'referrerpolicy',
    description:
      'Contrôle les informations envoyées dans l’en-tête Referer lors de la navigation.',
    mandatory: false
  }
];

type Props = {
  config: ElementConfigProps;
  onUpdate: (
    value: Record<string, any>,
    isContext: boolean,
    rootParams?: boolean
  ) => void;
  value: any;
};
function OptionsLinkBuilder({ config, onUpdate, value }: Props) {
  const [attributes, setAttributes] = useState<LinkAttributes[]>(value || []);

  useEffect(() => {
    setAttributes(value || []);
  }, [value]);

  const handleSelectValue = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = options.find(
      (option) => option.value === event.target.value
    );
    if (!selectedOption) return;
    const updateAttributes = (prevAttributes: LinkAttributes[]) => {
      if (
        prevAttributes.find(
          (attribute) => attribute.label === selectedOption.label
        )
      ) {
        return prevAttributes;
      }
      return [
        ...prevAttributes,
        { label: selectedOption.label, attr: event.target.value, value: '' }
      ];
    };
    const updatedAttributes = updateAttributes(attributes);
    setAttributes(updatedAttributes);
    onUpdate({ [config.propKey]: updatedAttributes }, config.context);
  };
  const handleDeleteLink = (index: number) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
    onUpdate({ [config.propKey]: newAttributes }, config.context);
  };

  const handleSelectPage = (page: IPage | null, index: number) => {
    if (!page) return;
    const newAttributes = [...attributes].map((attribute, i) => {
      if (i === index) {
        return {
          ...attribute,
          page: {
            route: page.route,
            slug: page.slug,
            name: page.name
          }
        };
      }
      return attribute;
    });
    setAttributes(newAttributes);
    onUpdate({ [config.propKey]: newAttributes }, config.context);
  };

  const handleDeletePageLink = (index: number) => {
    const newAttributes = [...attributes].map((attribute, i) => {
      if (i !== index) {
        return attribute;
      }
      return { ...attribute, page: undefined };
    });
    setAttributes(newAttributes);
    onUpdate({ [config.propKey]: newAttributes }, config.context);
  };

  return (
    <FormField>
      <FormLabel className='block'>
        <span>{config.label}</span>
      </FormLabel>
      <Selectbox options={options} onChange={handleSelectValue} />
      <ul>
        {attributes.map((attribute, index) => (
          <li key={index}>
            <FormField>
              <FormLabel className='block'>{attribute.label}</FormLabel>
              <Input
                disabled={!!attribute.page}
                value={attribute.value || ''}
                onChange={(e) => {
                  const newAttributes = [...attributes];
                  newAttributes[index].value = e.target.value;
                  setAttributes(newAttributes);
                }}
              />
              {attribute.attr === 'href' ? (
                <SelectPages
                  disabled={!!attribute.value}
                  onValueChange={(page) => handleSelectPage(page, index)}
                  value={attribute.page}
                  onDelete={() => handleDeletePageLink(index)}
                />
              ) : null}
              <DeleteButton onClick={() => handleDeleteLink(index)} />
            </FormField>
          </li>
        ))}
      </ul>
    </FormField>
  );
}
export default OptionsLinkBuilder;
