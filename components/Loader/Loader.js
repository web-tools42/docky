/* eslint-disable */
import React, { PropTypes, Component } from 'react';
import styles from './Loader.scss';

/**
 * Higher order component that displays a loader until your content is finished loading.
 *
 * Usage: 
 * ```
 * <Loader loading={false}>
 *    Some Content to Load
 * </Loader>
 * ```
 */
class Loader extends Component {
  render() {
    const {
      loading,
      children,
      height,
      width,
      text,
      style
    } = this.props;

    if (!loading) return children;

    return (
      <div
        class={styles.container}
        style={Object.assign({}, { width, height }, style)}>
        <svg
          class={styles.zalando}
          width="140px"
          height="136px"
          viewBox="0 0 140 136"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M20.28125,0.90625 C6.4387503,0.90625 -0.67875,38.7025 0.0625,74.1875 C0.0426542,74.1825 0.01984445,74.1925 0,74.1875 C0.74,105.33375 7.6275003,135.1875 21.28125,135.1875 C73.6775,135.1875 133.375,85.775 133.375,68.0625 C133.375,63.63125 128.86125,55.105 122.8125,48.375 C122.8045,48.3796 122.789,48.3704 122.7813,48.375 C122.37,47.8975 121.93375,47.42125 121.5,46.9375 C102.835,26.1125 64.1125,0.90625 20.28125,0.90625 Z" />
        </svg>

        {text ? <p class={styles.text}>{text}</p> : null}
      </div>
    );
  }
}

Loader.defaultProps = {
  loading: false
};

Loader.propTypes = {
  /**
   * Boolean to determine whether the loader should be shown
   */
  loading: PropTypes.bool.isRequired,
  /**
   * The content you wish to load
   */
  children: PropTypes.any.isRequired,
  /**
   * Optional loader container width parameter
   */
  width: PropTypes.number,
  /**
   * Optional loader container height parameter
   */
  height: PropTypes.number,
  /**
   * Optional loading text to be displayed below the loader
   */
  text: PropTypes.string,
  /**
   * Optional style options for the loader container
   */
  style: PropTypes.object
};

export default Loader;
