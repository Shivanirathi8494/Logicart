export async function searchDockets(query:string){

const response=await fetch(
"/api/dockets?tracking="+query
);

return response.json();

}
