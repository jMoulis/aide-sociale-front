'use server';

import sstk from 'shutterstock-api';

sstk.setAccessToken(process.env.SHUTTERSTOCK_API_TOKEN);

export const getImages = async (query: string) => {
  const imagesApi = new sstk.ImagesApi();

  const queryParams = {
    query,
    image_type: 'photo',
    page: 1,
    per_page: 20,
    sort: 'popular',
    view: 'minimal',
  };
  const { data } = await imagesApi.searchImages(queryParams);

  const filtered = data.map((image: any) => ({
    description: image.description,
    url: image.assets.preview_1000.url,
  }))
  return {
    query,
    images: JSON.stringify(filtered)
  }
}