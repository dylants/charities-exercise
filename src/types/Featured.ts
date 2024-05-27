export const FeaturedOption = {
  NATIONAL: 'NATIONAL',
  STATE: 'STATE',
};

type FeaturedType = (typeof FeaturedOption)[keyof typeof FeaturedOption];
export default FeaturedType;
