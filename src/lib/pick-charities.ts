import _ from 'lodash';
import Charity from '../types/Charity';
import Profile from '../types/Profile';
import { FeaturedOption } from '../types/Featured';
import {
  addCategoryMatches,
  buildAnimalRelatedCategoryMatches,
} from './category-matches';
import CategoryMatch from '../types/CategoryMatch';
import logger from './logger';
import { N_MAX_STATE, N_TOTAL } from '../constants';

function findAllMatchingStateCharities(
  charities: Array<Charity>,
  state: string,
): Array<Charity> {
  return charities.filter(
    (charity) =>
      charity.featured === FeaturedOption.STATE && charity.state === state,
  );
}

function findAllNationalCharities(charities: Array<Charity>): Array<Charity> {
  return charities.filter(
    (charity) => charity.featured === FeaturedOption.NATIONAL,
  );
}

function selectCharities({
  categoryMatches,
  charities,
  numToSelect,
}: {
  categoryMatches: Array<CategoryMatch>;
  charities: Array<Charity>;
  numToSelect: number;
}) {
  let selectedCharities: Array<Charity> = [];

  selectedCharities = selectedCharities.concat(
    addCategoryMatches({ categoryMatches, charities }),
  );

  selectedCharities = selectedCharities.concat(
    charities.slice(0, Math.max(numToSelect - selectedCharities.length, 0)),
  );

  return selectedCharities;
}

function selectStateCharities({
  categoryMatches,
  charities,
  numToSelect,
  state,
}: {
  categoryMatches: Array<CategoryMatch>;
  charities: Array<Charity>;
  numToSelect: number;
  state: string;
}): Array<Charity> {
  const stateCharities = findAllMatchingStateCharities(charities, state);
  const randomStateCharities = _.shuffle(stateCharities);

  return selectCharities({
    categoryMatches,
    charities: randomStateCharities,
    numToSelect,
  });
}

function selectNationalCharities({
  categoryMatches,
  charities,
  numToSelect,
}: {
  categoryMatches: Array<CategoryMatch>;
  charities: Array<Charity>;
  numToSelect: number;
}): Array<Charity> {
  const nationalCharities = findAllNationalCharities(charities);
  const randomNationalCharities = _.shuffle(nationalCharities);

  return selectCharities({
    categoryMatches,
    charities: randomNationalCharities,
    numToSelect,
  });
}

export default function pickCharities(
  charities: Array<Charity>,
  profile: Profile,
): Array<Charity> {
  logger.trace('N_TOTAL: %d', N_TOTAL);
  logger.trace('N_MAX_STATE: %d', N_MAX_STATE);

  const { hasPets, state } = profile;

  /**
   * Randomly calculate the number of state and national charities
   * to select, based off the constants.
   */
  const numStateCharities = _.random(N_MAX_STATE);
  const numNationalCharities = N_TOTAL - numStateCharities;
  logger.trace('numStateCharities: %d', numStateCharities);
  logger.trace('numNationalCharities: %d', numNationalCharities);

  /**
   * Build up the category matches, based off the user's profile
   */
  const stateCategoryMatches: Array<CategoryMatch> = [];
  const nationalCategoryMatches: Array<CategoryMatch> = [];
  if (hasPets) {
    const { nationalCategoryMatch, stateCategoryMatch } =
      buildAnimalRelatedCategoryMatches({
        numNationalCharities,
        numStateCharities,
      });

    stateCategoryMatches.push(stateCategoryMatch);
    nationalCategoryMatches.push(nationalCategoryMatch);
  }

  /**
   * Select the charities using the values computed above
   */
  const selectedStateCharities = selectStateCharities({
    categoryMatches: stateCategoryMatches,
    charities,
    numToSelect: numStateCharities,
    state,
  });

  const selectedNationalCharities = selectNationalCharities({
    categoryMatches: nationalCategoryMatches,
    charities,
    numToSelect: numNationalCharities,
  });

  const selectedCharities = _.shuffle(
    selectedStateCharities.concat(selectedNationalCharities),
  );

  return selectedCharities;
}
