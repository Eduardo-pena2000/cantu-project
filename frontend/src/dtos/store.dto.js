export function storeDto({
  id,
  avatar_url,
  name,
  code,
  address,
  address_detail,
  suburb_name,
  zip_code,
  municipality,
}) {
  return {
    id,
    image: avatar_url,
    name,
    code,
    address,
    addressDetail: address_detail,
    suburbName: suburb_name,
    zipCode: zip_code,
    municipality,
  };
}
