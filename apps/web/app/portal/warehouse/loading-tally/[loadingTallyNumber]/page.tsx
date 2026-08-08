import LoadingTallyPage
from "@/features/outscan/LoadingTallyPage";

export default async function Page({
params,
}:{
params:Promise<{
loadingTallyNumber:string;
}>;
}){

const {
loadingTallyNumber,
}=await params;

return(
<LoadingTallyPage
loadingTallyNumber={loadingTallyNumber}
/>
);

}
