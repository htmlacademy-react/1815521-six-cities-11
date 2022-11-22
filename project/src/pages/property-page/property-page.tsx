import {useEffect} from 'react';
import {useParams, Navigate} from 'react-router-dom';
//import {AppRoute} from '../../components/const';
import {useAppSelector} from '../../hooks/useAppSelector';
import {fetchCurrentOfferAction, fetchNearbyOffersAction} from '../../store/api-actions';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import Header from '../../components/header/header';
import CardList from '../../components/card-list/card-list';
import LoadingScreen from '../loading-screen/loading-screen';
import {CardClassName} from '../../components/const';
import ReviewList from '../../components/review-list.tsx/review-list';
import ReviewForm from '../../components/review-form/review-form';
import Map from '../../components/map/map';

function PropertyPage(): JSX.Element {
  const {id} = useParams();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchCurrentOfferAction(id));
      dispatch(fetchNearbyOffersAction(id));
    }
  }, [id, dispatch]);

  const offer = useAppSelector((state) => state.currentOffer);
  const nearbyOffers = useAppSelector((state) => state.nearbyOffers);

  const reviews = useAppSelector((state) => state.reviews);
  const isDataLoaded = useAppSelector((state) => state.isOffersDataLoading);

  if (isDataLoaded){
    <Navigate replace to="/" />;
  }

  if (!offer){
    return <LoadingScreen />;
  }

  const {images, title, isPremium, rating, type, bedrooms, maxAdults, goods,price, host, description} = offer;

  return (
    <div className="page">
      <Header />

      <main className="page__main page__main--property">
        <section className="property">
          <div className="property__gallery-container container">
            <div className="property__gallery">
              {
                images.map((image) => (
                  <div className="property__image-wrapper" key={image}>
                    <img className="property__image" src={image} alt="studio" />
                  </div>
                ))
              }
            </div>
          </div>
          <div className="property__container container">
            <div className="property__wrapper">
              {isPremium && <div className="property__mark"><span>Premium</span></div>}
              <div className="property__name-wrapper">
                <h1 className="property__name">
                  {title}
                </h1>
                <button className="property__bookmark-button button" type="button">
                  <svg className="property__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">To bookmarks</span>
                </button>
              </div>
              <div className="property__rating rating">
                <div className="property__stars rating__stars">
                  <span style={{width: '80%'}}></span>
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="property__rating-value rating__value">{rating}</span>
              </div>
              <ul className="property__features">
                <li className="property__feature property__feature--entire">
                  {type}
                </li>
                <li className="property__feature property__feature--bedrooms">
                  {bedrooms} Bedrooms
                </li>
                <li className="property__feature property__feature--adults">
                  Max {maxAdults} adults
                </li>
              </ul>
              <div className="property__price">
                <b className="property__price-value">&euro;{price}</b>
                <span className="property__price-text">&nbsp;night</span>
              </div>
              <div className="property__inside">
                <h2 className="property__inside-title">What&apos;s inside</h2>
                <ul className="property__inside-list">
                  {goods.map((good) =>
                    <li key={good} className="property__inside-item">{good}</li>)}
                </ul>
              </div>
              <div className="property__host">
                <h2 className="property__host-title">Meet the host</h2>
                <div className="property__host-user user">
                  <div className="property__avatar-wrapper property__avatar-wrapper--pro user__avatar-wrapper">
                    <img className="property__avatar user__avatar" src={host.avatarUrl} width="74" height="74" alt="Host avatar"/>
                  </div>
                  <span className="property__user-name">
                    {host.name}
                  </span>
                  {host.isPro && <span className="property__user-status">Pro</span>}
                </div>
                <div className="property__description">
                  <p className="property__text">
                    {description}
                  </p>
                </div>
              </div>
              <section className="property__reviews reviews">
                <ReviewList reviews={reviews}/>
                <ReviewForm />
              </section>
            </div>
          </div>
          <Map offers={nearbyOffers.concat(offer)} className='property__map' city={offer.city.name} selectedOffer={offer}/>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <div className="near-places__list places__list">
              <CardList offers={nearbyOffers} className={CardClassName.Near} onCardHover={() => null} onCardLeave={() => null}/>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default PropertyPage;
