import {Link} from 'react-router-dom';
import {Offer} from '../../types/offer';
import {CardClassName} from '../../components/const';

type CardProps = {
  offer: Offer;
  className: CardClassName;
  onMouseOver?: () => void;
}

function Card ({offer, className, onMouseOver}: CardProps) {
  const {id, previewImage, isPremium, price, rating, title, type} = offer;

  return(
    <article key={id} className={`${className}__card place-card`}
      onMouseOver={onMouseOver}
    >
      {isPremium ? <div className="place-card__mark"><span>Premium</span></div> : null}
      <div className={`${className}__image-wrapper place-card__image-wrapper`}>
        <Link to={`/offer/${id}`}>
          <img className="place-card__image" src={previewImage} width="260" height="200" alt="Place" />
        </Link>
      </div>
      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button className="place-card__bookmark-button place-card__bookmark-button--active button" type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">In bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: '80%'}}></span>
            <span className="visually-hidden">{rating}</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`/offer/${id}`}>{title}</Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

export default Card;