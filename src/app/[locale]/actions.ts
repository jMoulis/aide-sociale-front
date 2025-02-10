'use server';

import { bucket } from "@/lib/firebase/firebaseAdmin";
import { getServerSideCurrentUserOrganizationId } from "@/lib/utils/auth/serverUtils";
import { getDownloadURL } from "firebase-admin/storage";

export async function uploadFile(file: File, path: string) {
  const organizationId = await getServerSideCurrentUserOrganizationId();

  const fullstoragePath = `${organizationId}/${path}`;
  console.log('uploading file', file, path)
  try {
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const fileUpload = bucket.file(fullstoragePath);
    await fileUpload.save(fileBuffer, {
      metadata: {
        contentType: file.type,
      },
    });
    const downloadUrl = await getDownloadURL(fileUpload);
    console.log('downloadUrl', downloadUrl)
    return downloadUrl;

  } catch (error) {
    console.log('FirebaseError', error)
    return null;
  }
  // .upload(file, {
  //   destination: storagePath,
  //   public: true, // Make the file publicly accessible
  // });
}