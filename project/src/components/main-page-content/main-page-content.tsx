import {useState, useMemo, useCallback} from 'react';
import {useAppSelector} from '../../hooks/useAppSelector';
import CardList from '../../components/card-list/card-list';
import Map from '../../components/map/map';
import SortForm from '../../components/sort-form/sort-form';
import {CardClassName} from '../../components/const';
import LoadingScreen from '../../pages/loading-screen/loading-screen';
import {Offer} from '../../types/offer';
import {SortType} from '../../components/const';
import {getCity, getSortType, getOffersByCity} from '../../store/action-process/selectors';
import {getOffersLoadedData} from '../../store/data-process/selectors';

function MainPageContent(): JSX.Element {
  const activeSortType = useAppSelector(getSortType);
  const offers = useAppSelector(getOffersByCity);

  const currentCity = useAppSelector(getCity);

  const getSortedOffers = useCallback((currentSortType: string) => {
    switch (currentSortType) {
      case SortType.Popular:
        return offers;
      case SortType.LowToHigh:
        return offers.sort((offerA, offerB) => offerA.price - offerB.price);
      case SortType.HighToLow:
        return offers.sort((offerA, offerB) => offerB.price - offerA.price);
      case SortType.TopRatedFirst:
        return offers.sort((offerA, offerB) => offerB.rating - offerA.rating);
    }
  }, [offers]);

  const sortedOffers = useMemo(() => getSortedOffers(activeSortType), [activeSortType, getSortedOffers]);

  const [selectedOffer, setSelectedOffer] = useState<Offer | undefined>(
    undefined
  );

  const handleCardHover = (cardOfferId: number) => {
    const currentOffer = offers.find((offer) => offer.id === cardOfferId);

    setSelectedOffer(currentOffer);
  };

  const offerLoadingStatus = useAppSelector(getOffersLoadedData);

  if (offerLoadingStatus) {
    return (<LoadingScreen />);
  }

  return (
    <div className="cities">
      <div className="cities__places-container container">
        <section className="cities__places places">
          <h2 className="visually-hidden">Places</h2>
          <b className="places__found">{`${offers.length} places to stay in ${currentCity}`}</b>
          <SortForm />
          <div className="cities__places-list places__list tabs__content">
            <CardList offers={sortedOffers as Offer[]} className={CardClassName.Cities} onCardHover={handleCardHover} />
          </div>
        </section>
        <div className="cities__right-section">
          <Map offers={offers} className='cities' city={currentCity} selectedOffer={selectedOffer}/>
        </div>
      </div>
    </div>
  );
}

export default MainPageContent;