import React from 'react'

const LoadingOverlay = () => {
  return (
    <div class="border border-blue-300 shadow rounded-md p-4 w-full mx-auto">
      <div class="animate-pulse flex space-x-4">
        <div class="flex-1 space-y-6 py-1">
          <div class="h-2 bg-slate-200 rounded"></div>
          <div class="space-y-3">
            <div class="grid grid-cols-3 gap-4">
              <div class="h-2 bg-slate-200 rounded col-span-2"></div>
              <div class="h-2 bg-slate-200 rounded col-span-1"></div>
            </div>
            <div class="h-2 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingOverlay

{/* <div class="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
<div class="animate-pulse flex space-x-4">
  <div class="rounded-full bg-slate-200 h-10 w-10"></div>
  <div class="flex-1 space-y-6 py-1">
    <div class="h-2 bg-slate-200 rounded"></div>
    <div class="space-y-3">
      <div class="grid grid-cols-3 gap-4">
        <div class="h-2 bg-slate-200 rounded col-span-2"></div>
        <div class="h-2 bg-slate-200 rounded col-span-1"></div>
      </div>
      <div class="h-2 bg-slate-200 rounded"></div>
    </div>
  </div>
</div>
</div> */}

// import React from 'react'
// import { useDisplayContext } from '../contexts/DisplayContext'


// const LoadingOverlay = () => {
//   const { loading } = useDisplayContext();

//   if (!loading) {
//     return null;
//   }

//   return (
//     <div className="fixed w-screen h-screen top-0 left-0 right-0 bottom-0 inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[90]">
//       <div
//         class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-[#62a2d7] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
//         role="status">
//       </div>
//       <div className="px-2">
//       Loading, please wait...
//       </div>
//     </div>)
// }

// export default LoadingOverlay