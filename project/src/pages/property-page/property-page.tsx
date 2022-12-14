import {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import cn from 'classnames';
import {useAppSelector} from '../../hooks/useAppSelector';
import {fetchCurrentOfferAction, fetchNearbyOffersAction, fetchReviewListAction} from '../../store/api-actions';
import {useAppDispatch} from '../../hooks/useAppDispatch';
import Header from '../../components/header/header';
import CardList from '../../components/card-list/card-list';
import LoadingScreen from '../loading-screen/loading-screen';
import {CardClassName, MIN_PROPERTY_IMAGES_COUNT, MAX_PROPERTY_IMAGES_COUNT} from '../../components/const';
import ReviewList from '../../components/review-list.tsx/review-list';
import ReviewForm from '../../components/review-form/review-form';
import Map from '../../components/map/map';
import {AuthorizationStatus, REVIEW_STAR_WIDTH, AppRoute, FavoriteStatus} from '../../components/const';
import NotFoundPage from '../not-found-page/not-found-page';
import {getCurrentOffer, getNearbyOffers, getOffersLoadedData, getReviews} from '../../store/data-process/selectors';
import {getAuthorizationStatus} from '../../store/user-process/selectors';
import {redirectToRoute} from '../../store/action';
import {changeFavoriteStatusAction} from '../../store/api-actions';
import './property-page.css';

function PropertyPage(): JSX.Element {
  const {id} = useParams();
  const dispatch = useAppDispatch();

  const offer = useAppSelector(getCurrentOffer);
  const nearbyOffers = useAppSelector(getNearbyOffers);

  const reviews = useAppSelector(getReviews);

  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const isOffersDataLoading = useAppSelector(getOffersLoadedData);

  useEffect(() => {
    if (id) {
      dispatch(fetchCurrentOfferAction(id));
      dispatch(fetchNearbyOffersAction(id));
      dispatch(fetchReviewListAction(id));
    }
  }, [id, dispatch]);

  if(isOffersDataLoading) {
    return <LoadingScreen/>;
  }

  if(!offer) {
    return <NotFoundPage/>;
  }

  const {images, title, isPremium, rating, type, bedrooms, maxAdults, goods,price, host, description, isFavorite} = offer;

  const handleButtonClick = () => {
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      dispatch(redirectToRoute(AppRoute.Login));
    }
    else {dispatch(changeFavoriteStatusAction({
      id: offer.id,
      status: (isFavorite) ? FavoriteStatus.Favorite : FavoriteStatus.NotFavorite,
    }));
    }
  };

  return (
    <div className="page">
      <Header />

      <main className="page__main page__main--property">
        <section className="property">
          <div className="property__gallery-container container">
            <div className="property__gallery">
              {
                images.slice(MIN_PROPERTY_IMAGES_COUNT, MAX_PROPERTY_IMAGES_COUNT).map((image) => (
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
                <button className={cn('property__bookmark-button', {'property__bookmark-button--active' : isFavorite && authorizationStatus === AuthorizationStatus.Auth}, 'button')} type="button" onClick={handleButtonClick}>
                  <svg className="property__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark"></use>
                  </svg>
                  <span className="visually-hidden">{isFavorite ? 'In bookmarks' : 'To bookmarks'}</span>
                </button>
              </div>
              <div className="property__rating rating">
                <div className="property__stars rating__stars">
                  <span style={{width: `${Math.round(rating) * REVIEW_STAR_WIDTH}%`}}></span>
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
                {(authorizationStatus === AuthorizationStatus.Auth) ? <ReviewForm/> : ''}
              </section>
            </div>
          </div>
          <Map offers={nearbyOffers.concat(offer)} className='property__map' city={offer.city.name} />
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <div className="near-places__list places__list">
              <CardList offers={nearbyOffers} className={CardClassName.Near} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default PropertyPage;
