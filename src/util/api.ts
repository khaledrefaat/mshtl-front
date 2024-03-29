export async function sendRequest(url: string, isDelete = false) {
  let res;
  if (isDelete) res = await fetch(url, { method: 'DELETE' });
  else res = await fetch(url);
  const result = await res.json();

  if (!res.ok) throw result;
  else return result;
}
