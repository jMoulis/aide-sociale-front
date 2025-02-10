import { Skeleton } from '@/components/ui/skeleton';

function PageBuilderSkeleton() {
  return (
    <div className='flex-1 flex flex-col w-full space-y-5'>
      <header className='flex space-x-3'>
        <Skeleton className='h-10 w-20' />
        <Skeleton className='h-10 w-20' />
        <Skeleton className='h-10 w-20' />
      </header>
      <div className='flex-1 flex'>
        <div className='w-[250px] space-y-3'>
          <Skeleton className='h-12 w-[250px]' />
          <Skeleton className='h-12 w-[250px]' />
          <Skeleton className='h-12 w-[250px]' />
        </div>
        <div className='flex-1 flex px-10 justify-center'>
          <Skeleton className='flex-1 h-1/2' />
        </div>
        <div className='w-[250px] space-y-3'>
          <Skeleton className='h-12 w-[250px]' />
          <Skeleton className='h-12 w-[250px]' />
          <Skeleton className='h-12 w-[250px]' />
          <Skeleton className='h-12 w-[250px]' />
          <Skeleton className='h-12 w-[250px]' />
        </div>
      </div>
    </div>
  );
}
export default PageBuilderSkeleton;
