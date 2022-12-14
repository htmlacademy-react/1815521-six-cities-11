import Card from '../../components/card/card';
import {CardClassName} from '../../components/const';
import {Offer} from '../../types/offer';
import {CITIES} from '../const';

type FavoritesCardListProps = {
  offers: Offer[];
  className: CardClassName;
}

function FavoritesCardList({offers, className}:FavoritesCardListProps) {
  return(
    <ul className="favorites__list">
      {CITIES.map((city) => {
        const currentCityOffers = offers.filter((offer) => offer.city.name === city.name && offer.isFavorite);
        if(currentCityOffers.length > 0){
          return(
            <li key={city.name} className="favorites__locations-items">
              <div className="favorites__locations locations locations--current">
                <div className="locations__item">
                  <a className="locations__item-link" href="#!">
                    <span>{city.name}</span>
                  </a>
                </div>
              </div>
              <div className="favorites__places">
                {currentCityOffers.map((offer)=> (
                  <Card
                    key={offer.id}
                    offer={offer}
                    className={className}
                  />
                ))}
              </div>
            </li>
          );}
        return null;
      }
      )}
    </ul>
  );
}

export default FavoritesCardList;
