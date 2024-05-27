import Featured from './Featured';

type Charity = {
  id: number;
  name: string;
  state?: string;
  category: string;
  featured?: Featured;
};

export default Charity;
