// Libraries
import * as React from 'react';

// Dependencies
import { IButtonsNavProps } from './typings';
import { SliderContext } from '../Context';

// CSS
import ButtonsNavModuleCss from './ButtonsNav.module.css';

// Components
import { Nav } from '../Nav';

const { useContext, memo } = React;

const SliderNav = memo((props: IButtonsNavProps) => {
  /**
   * Deconstructing ButtonNavSettings to set it up.
   */
  const {
    color,
    activeColor,
    backgroundColor,
    position,
    // totalSlides,
    // activeSlide,
    // changeSlide,
    justifyContent,
    alignItems,
    // navDescriptions,
    sliderWidth = window.innerWidth,
    mobileThreshold = 1024,
    isNullAfterThreshold,
    extraButton,
    isExtraButtonRight,
  } = props;

  const { navProps, slidesArray } = useContext(SliderContext);

  /**
   * CSS variables for the transitions.
   */
  const CSSVariables = {
    '--nav-color': color,
    '--nav-background-color': backgroundColor,
    '--nav-active-color': activeColor,
  };

  const ButtonNavButtons = React.useMemo(
    () => {
      if (
        !navProps ||
        !slidesArray.length
      ) return [];
      const {
        changeSlide,
        activeSlide,
      } = navProps;
      const changeSlideHandler = (ButtonNavButtonIndex: number) => {
        const nextSlide = ButtonNavButtonIndex + 1;
        if (nextSlide !== activeSlide) {
          changeSlide(nextSlide);
        }
      };
      return slidesArray.map(({ navDescription }, index) => {
        const description = navDescription;
        const respectiveSlide = index + 1;
        return (
          <li
            key={index}
            onClick={() => changeSlideHandler(index)}
            className={[
              ButtonsNavModuleCss.Button,
              activeSlide === respectiveSlide && ButtonsNavModuleCss.Active,
            ].join(' ')}>
            <div className={ButtonsNavModuleCss.Description}>
              <div className={ButtonsNavModuleCss.Text}>
                {description}
              </div>
            </div>
          </li>
        );
      });
    },
    [navProps, slidesArray],
  );

  if (sliderWidth <= mobileThreshold) {
    if (isNullAfterThreshold) return null;
    return (
      <Nav {...props} />
    );
  }

  return (
    <div
      style={{
        bottom: !position ? '0' : undefined,
        left: !position ? '50%' : undefined,
        transform: !position ? 'translateX(-50%)' : undefined,
        ...position,
        ...CSSVariables,
      }}
      className={ButtonsNavModuleCss.Wrapper}>
      <ul
        style={{
          justifyContent: justifyContent || 'center',
          /**
           * The **vertical alignment** of the buttons can be set manually.
           * If it's undefined and if there is a position top passed as prop,
           * then `alignItems` will be `flex-start`. Otherwise,
           * it is set as `flex-end`.
           */
          alignItems: (
            alignItems || ((position && position.top !== undefined) ? 'flex-start' : 'flex-end')
          ),
        }}
        className={ButtonsNavModuleCss.Container}>
        {ButtonNavButtons}
        {extraButton && (
          <div
            style={{
              order: isExtraButtonRight ? 1 : 0,
            }}
            className={ButtonsNavModuleCss.ExtraButton}>
            {extraButton}
          </div>
        )}
      </ul>
    </div>
  );
});

export const ButtonsNav = (props: IButtonsNavProps): JSX.Element => <SliderNav {...props} />;
(ButtonsNav as React.FunctionComponent).displayName = 'hero-slider/menu-nav';
