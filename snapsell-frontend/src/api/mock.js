export async function getAuctions() {
  const res = await fetch("/auctions.json");
  return res.json();
}

export async function getAuctionById(id) {
  const res = await fetch("/auctions.json");
  const data = await res.json();
  return data.find((a) => a.id === parseInt(id));
}
