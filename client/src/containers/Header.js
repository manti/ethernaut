import React from "react";
import onClickOutside from "react-onclickoutside";
import { connect } from "react-redux";
import { withRouter } from "../hoc/withRouter";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import * as actions from "../actions";
import * as constants from "../constants";
import { loadTranslations } from "../utils/translations";
import PropTypes from "prop-types";
import { ProgressBar } from "react-loader-spinner";
import { svgFilter } from "../utils/svg";
import LeaderIcon from "../components/leaderboard/LeaderIcon";
// import parse from "html-react-parser";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dark: false,
      lang: localStorage.getItem("lang"),
      chainId: 0,
      activeDropdown: null,
      multiDDOpen: false,
    };

    if (this.props.web3) {
      window.ethereum.request({ method: "eth_chainId" }).then((id) => {
        this.setState({ chainId: Number(id) });
      });
    }
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
  };

  setActiveTab(tabIndex) {
    const { activeDropdown } = this.state;
    const newState =
      activeDropdown === tabIndex && activeDropdown ? null : tabIndex;
    this.setState({ activeDropdown: newState });
  }

  getDDClassName(tabdcurrentTabIndex) {
    const { activeDropdown } = this.state;
    const className = tabdcurrentTabIndex === activeDropdown ? "show" : "hide";
    return className;
  }

  toggleDropdownState() {
    this.setState({
      multiDDOpen: !this.state.multiDDOpen,
    });
  }

  closeDropdown() {
    if (!this.state.multiDDOpen) return;
    this.setState({
      multiDDOpen: false,
    });
  }

  componentDidMount() {
    // var black = getComputedStyle(document.documentElement).getPropertyValue(
    //   "--black"
    // );
    // var primaryColor = getComputedStyle(document.documentElement).getPropertyValue(
    //   "--primary-color"
    // );
    // if(primaryColor === black) this.toggleDarkMode()
  }

  componentDidUpdate(prevProps) {
    if (prevProps && this.props.location !== prevProps.location) {
      let elements = document.getElementsByClassName("level-tile");
      if (elements.length !== 0) {
        for (let i = 0; i < elements.length; i++) {
          let element = elements[i];
          if (element && element.style)
            element.style.filter = this.state.dark ? svgFilter() : null;
        }
      }

      // Change The Ethernaut logo
      var theEthernaut = document.getElementById("the-ethernaut");
      if (theEthernaut && theEthernaut.style)
        theEthernaut.style.filter = this.state.dark ? svgFilter() : null;

      // Change Arrow
      let isArrowInPage = document.getElementById("arrow");
      if (isArrowInPage && isArrowInPage.style)
        isArrowInPage.style.filter = this.state.dark ? svgFilter() : null;

      // Change all custom images
      var imageElements = document.getElementsByClassName("custom-img");
      if (imageElements.length !== 0) {
        for (let i = 0; i < imageElements.length; i++) {
          let element = imageElements[i];
          if (imageElements.length === 0) element = imageElements;
          if (element && element.style)
            element.style.filter = this.state.dark ? svgFilter() : null;
        }
      }
    }
  }

  changeLanguage(e, value) {
    e.preventDefault();
    this.props.setLang(value);
  }

  async changeNetwork(network) {
    const elements = document.querySelectorAll(".progress-bar-wrapper");
    elements[0].style.display = "flex";
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (Number(chainId) === Number(network.id)) {
        return;
      }
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: `0x${Number(network.id).toString(16)}`,
          },
        ],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${Number(network.id).toString(16)}`,
                chainName: network.name,
                rpcUrls: [network.rpcUrl],
                nativeCurrency: {
                  name: network.currencyName,
                  symbol: network.currencySymbol,
                  decimals: 18,
                },
                blockExplorerUrls: [network.blockExplorer],
              },
            ],
          });
        } catch (addError) {
          if (addError.code === 4001) {
            //User has rejected changing the request
            elements[0].style.display = "none";
          }
          console.error("Can't add nor switch to the selected network");
        }
      } else if (switchError.code === 4001) {
        //User has rejected changing the request
        elements[0].style.display = "none";
      }
    }
  }

  toggleDarkMode() {
    var documentElement = document.documentElement;
    if (documentElement && documentElement.style) {
      var pink = getComputedStyle(document.documentElement).getPropertyValue(
        "--pink"
      );
      var black = getComputedStyle(document.documentElement).getPropertyValue(
        "--black"
      );

      var newPrimary = this.state.dark ? pink : black;
      var newSecondary = this.state.dark ? black : pink;

      document.documentElement.style.setProperty("--primary-color", newPrimary);
      document.documentElement.style.setProperty(
        "--secondary-color",
        newSecondary
      );

      // Change OpenZeppelin logo
      var theLogo = document.getElementById("logo");
      if (theLogo && theLogo.style)
        theLogo.style.filter = !this.state.dark ? svgFilter() : null;

      // // Change OpenZeppelin logo
      // var theChristmashat = document.getElementById("christmas-hat")
      // if (theChristmashat && theChristmashat.style) theChristmashat.style.filter = !this.state.dark
      //   ? svgFilter()
      //   : null;

      // Change The Ethernaut logo
      var theEthernaut = document.getElementById("the-ethernaut");
      if (theEthernaut && theEthernaut.style)
        theEthernaut.style.filter = !this.state.dark ? svgFilter() : null;

      // Change Arrow
      let isArrowInPage = document.getElementById("arrow");
      if (isArrowInPage && isArrowInPage.style)
        isArrowInPage.style.filter = !this.state.dark ? svgFilter() : null;

      // Change Mosaic and levels logo
      let elements = document.getElementsByClassName("level-tile");
      for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        if (element && element.style)
          element.style.filter = !this.state.dark ? svgFilter() : null;
      }

      // Change all custom images
      elements = document.getElementsByClassName("custom-img");
      for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        if (element && element.style)
          element.style.filter = !this.state.dark ? svgFilter() : null;
      }

      this.setState({
        dark: !this.state.dark,
      });
    }
  }

  handleClickOutside = () => {
    this.closeDropdown();
  };

  render() {
    let strings = loadTranslations(this.state.lang);

    const LANGUAGES_MAP = {
      en: strings.english,
      es: strings.spanish,
      pt_br: strings.portuguese,
      ja: strings.japanese,
      zh_cn: strings.chinese_simplified,
      zh_tw: strings.chinese_traditional,
      fr: strings.french,
      ru: strings.russian,
      ar: strings.arabic,
      tr: strings.turkish,
    };

    const ddOpen = Boolean(this.state.multiDDOpen);
    return (
      <div className="header-container" onClick={() => this.closeDropdown()}>
        {/* <div className="lines">
          <center>
            <hr className="top" />
          </center>
          <center>
            <hr className="top" />
          </center>
        </div> */}
        {/* <div className="top-banner">
           <div className="top-banner-text">{parse(strings.ctfInfo)}</div>
            <a
              href="https://ctf.openzeppelin.com"
            >
              <button>{strings.ctfRegister}</button>
            </a>
        </div> */}

        <center>
          <header>
            <a className="logo-container" href="/">
              <svg
                width="177"
                height="36"
                viewBox="0 0 177 36"
                fill="none"
                class="h-[36px] w-[177px]"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M53.2077 2.70294C52.6163 1.66889 51.3507 0.438492 48.6711 0.438492C46.2097 0.438492 42.4717 1.48782 37.5598 3.5603C34.4634 1.2304 30.7757 0 26.8894 0C17.0284 0 9.00705 8.07393 9.00705 18C9.00705 18.685 9.04632 19.3875 9.12488 20.0856C8.18003 20.812 7.29628 21.521 6.49763 22.1951C4.7585 23.6633 2.59385 25.6027 1.2715 27.601C-0.140318 29.7324 -0.378167 31.65 0.566683 33.2971C1.16021 34.3311 2.4302 35.5615 5.10327 35.5615C7.56468 35.5615 11.3026 34.5122 16.2145 32.4397C19.3131 34.7696 23.0009 36 26.8894 36C36.7481 36 44.7695 27.9261 44.7695 18C44.7695 17.3128 44.7302 16.6147 44.6517 15.9188C45.5485 15.2294 46.393 14.5531 47.1654 13.903L47.2833 13.8049C47.3204 13.7721 47.3596 13.7416 47.3967 13.7089H47.4011C49.1184 12.2494 51.2154 10.3515 52.5072 8.39898C53.919 6.26542 54.1547 4.35002 53.212 2.70294H53.2077ZM12.8672 21.7523C15.7956 19.6034 19.2411 17.3281 22.8394 15.1683L29.0824 26.0565L30.3567 25.3257C30.4702 25.2624 30.5858 25.1948 30.6971 25.1293L30.9066 25.0071C31.3234 24.765 31.738 24.5207 32.1482 24.2785L32.4712 24.0887C35.5676 22.2431 38.5025 20.3495 41.1952 18.4581C40.9552 26.183 34.5987 32.4157 26.8872 32.4157C24.3188 32.4157 21.8007 31.722 19.6033 30.4087C18.6585 29.8415 17.7791 29.1696 16.9935 28.4104L16.8451 28.2664L16.6553 28.3515C15.6472 28.8009 14.6674 29.2197 13.74 29.5928C10.9077 30.7315 8.47898 31.4973 6.71148 31.8114C5.82773 31.9685 5.10982 32.0143 4.57738 31.9467C4.0995 31.8856 3.78746 31.7372 3.65654 31.5082C3.52343 31.2769 3.5518 30.9322 3.73946 30.4828C3.94676 29.9855 4.34608 29.3812 4.92434 28.6896C6.07867 27.3087 7.95309 25.5744 10.349 23.6764C11.1062 23.0721 11.9529 22.4264 12.8672 21.7545V21.7523ZM40.9094 14.2521C38.0072 16.3835 34.5682 18.6545 30.9502 20.8251L24.7073 9.93916L24.1879 10.2358C23.8475 10.43 23.518 10.6198 23.1907 10.8096L22.8699 10.995C22.3484 11.2961 21.8291 11.6015 21.3206 11.9069C18.1762 13.7852 15.2391 15.6832 12.5813 17.5484C12.8214 9.82136 19.1778 3.58647 26.8915 3.58647C29.4577 3.58647 31.9758 4.28021 34.1732 5.59569C35.105 6.1498 35.9844 6.82172 36.7874 7.59399L36.9357 7.73797L37.1234 7.65289C38.125 7.20567 39.1048 6.78899 40.0365 6.41159C42.8689 5.27282 45.2976 4.50709 47.0651 4.19295C47.9488 4.03587 48.6689 3.99006 49.1992 4.05769C49.677 4.11877 49.9891 4.26712 50.12 4.49618C50.2531 4.72743 50.2247 5.07211 50.0371 5.52151C49.8298 6.01891 49.4305 6.6232 48.8522 7.31475C47.6979 8.69785 45.8234 10.4322 43.4275 12.3323C42.6201 12.9737 41.7713 13.6216 40.9094 14.2543V14.2521Z"
                  fill="black"
                ></path>
                <path
                  d="M62.1245 10.4556H65.7397L76.2525 23.1508V10.4556H79.8411V28.4449H76.2525L65.7397 15.7497V28.4449H62.1245V10.4556Z"
                  fill="black"
                ></path>
                <path
                  d="M84.1504 16.4949C85.2438 15.3993 86.996 14.8492 89.4068 14.8492C91.8177 14.8492 93.5698 15.397 94.6632 16.4949C95.7567 17.5905 96.3045 19.3471 96.3045 21.7624C96.3045 24.1777 95.7567 25.9609 94.6632 27.0565C93.5698 28.1366 91.8177 28.6756 89.4068 28.6756C86.996 28.6756 85.2438 28.1366 84.1504 27.0565C83.0725 25.9609 82.5358 24.1954 82.5358 21.7624C82.5358 19.3294 83.0747 17.5905 84.1504 16.4949ZM85.8959 21.7624C85.8959 23.0643 86.1687 24.0158 86.7165 24.6146C87.2799 25.2134 88.1781 25.5151 89.409 25.5151C90.64 25.5151 91.5294 25.2157 92.075 24.6146C92.6383 24.0158 92.9222 23.0643 92.9222 21.7624C92.9222 20.4605 92.6405 19.4913 92.075 18.9102C91.5271 18.3113 90.64 18.0097 89.409 18.0097C88.1781 18.0097 87.2821 18.3091 86.7165 18.9102C86.1687 19.4935 85.8959 20.4427 85.8959 21.7624Z"
                  fill="black"
                ></path>
                <path
                  d="M97.3203 15.0821H100.909L104.497 24.5658L108.086 15.0821H111.701L106.42 28.4471H102.601L97.3203 15.0821Z"
                  fill="black"
                ></path>
                <path
                  d="M117.432 28.6778C115.707 28.6778 114.434 28.3518 113.613 27.7019C112.81 27.0343 112.409 25.972 112.409 24.5148C112.409 23.0576 112.852 21.962 113.742 21.3277C114.631 20.6756 116.066 20.3518 118.049 20.3518H122.048C121.979 19.4447 121.697 18.7926 121.203 18.3978C120.723 17.9875 119.972 17.7813 118.947 17.7813C117.29 17.7813 116.314 18.3735 116.024 19.5556H112.69C112.894 17.9099 113.502 16.7189 114.511 15.9826C115.52 15.2285 117.042 14.8514 119.076 14.8514C121.298 14.8514 122.913 15.315 123.922 16.2398C124.931 17.147 125.434 18.6219 125.434 20.6601V28.4471H122.05V27.1874C121.076 28.181 119.537 28.6778 117.434 28.6778H117.432ZM115.791 24.3595C115.791 25.2844 116.62 25.7479 118.277 25.7479C119.439 25.7479 120.311 25.5417 120.892 25.1314C121.491 24.7033 121.875 24.0446 122.045 23.153V22.8447H118.943C116.84 22.8447 115.789 23.3504 115.789 24.3618L115.791 24.3595Z"
                  fill="black"
                ></path>
                <path
                  d="M127.805 24.1799H131.139C131.463 25.2245 132.549 25.7479 134.395 25.7479C136.24 25.7479 137.061 25.3887 137.061 24.6678C137.061 24.018 135.94 23.5367 133.703 23.2284C131.618 22.9889 130.138 22.5431 129.267 21.891C128.395 21.2234 127.958 20.2298 127.958 18.9102C127.958 17.5218 128.42 16.5038 129.342 15.8517C130.265 15.1841 131.726 14.8492 133.727 14.8492C135.728 14.8492 137.333 15.2085 138.342 15.9293C139.367 16.6324 139.975 17.7702 140.163 19.3471H136.83C136.641 18.7993 136.3 18.4045 135.805 18.165C135.326 17.9077 134.616 17.7791 133.678 17.7791C132.055 17.7791 131.243 18.114 131.243 18.7815C131.243 19.3981 132.268 19.8439 134.319 20.1189C136.575 20.445 138.138 20.9152 139.01 21.5317C139.882 22.1306 140.319 23.082 140.319 24.3839C140.319 25.8234 139.831 26.9035 138.857 27.6221C137.899 28.3251 136.377 28.6756 134.293 28.6756C132.208 28.6756 130.695 28.3163 129.653 27.5955C128.61 26.8769 127.994 25.7369 127.807 24.1777L127.805 24.1799Z"
                  fill="black"
                ></path>
                <path
                  d="M147.023 15.0821H150.663V18.2426H147.023V23.3837C147.023 24.0513 147.176 24.5392 147.485 24.8497C147.793 25.1402 148.305 25.2866 149.024 25.2866H150.896V28.4471H148.922C147.077 28.4471 145.735 28.079 144.896 27.3426C144.058 26.6063 143.641 25.4241 143.641 23.7962V18.2448H141.691V15.0843H143.641V12.1811H147.026V15.0843L147.023 15.0821Z"
                  fill="black"
                ></path>
                <path
                  d="M153.156 28.4449V15.0799H156.54V16.2886C157.394 15.3283 158.712 14.8492 160.488 14.8492H161.77V18.0097H159.463C158.421 18.0097 157.669 18.3003 157.208 18.8836C156.764 19.4669 156.54 20.425 156.54 21.7624V28.4449H153.156Z"
                  fill="black"
                ></path>
                <path
                  d="M164.598 16.4949C165.691 15.3993 167.443 14.8492 169.854 14.8492C172.265 14.8492 174.017 15.397 175.111 16.4949C176.204 17.5905 176.752 19.3471 176.752 21.7624C176.752 24.1777 176.204 25.9609 175.111 27.0565C174.017 28.1366 172.265 28.6756 169.854 28.6756C167.443 28.6756 165.691 28.1366 164.598 27.0565C163.522 25.9609 162.983 24.1954 162.983 21.7624C162.983 19.3294 163.522 17.5905 164.598 16.4949ZM166.341 21.7624C166.341 23.0643 166.614 24.0158 167.162 24.6146C167.725 25.2134 168.623 25.5151 169.854 25.5151C171.085 25.5151 171.975 25.2157 172.52 24.6146C173.084 24.0158 173.367 23.0643 173.367 21.7624C173.367 20.4605 173.086 19.4913 172.52 18.9102C171.972 18.3113 171.085 18.0097 169.854 18.0097C168.623 18.0097 167.727 18.3091 167.162 18.9102C166.614 19.4935 166.341 20.4427 166.341 21.7624Z"
                  fill="black"
                ></path>
              </svg>
            </a>
            {/* ---- Multi Dropdown Container */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="multi-dropdown"
            >
              {/* dropdown icon */}
              <div
                onClick={() => this.toggleDropdownState()}
                className="multi-dropdown__icon"
              >
                <i className="fas fa-bars"></i>
              </div>
              {/* dropdown icon */}
              {/* dropdown content */}
              <ul
                className={`multi-dropdown__dropdown ${
                  ddOpen ? "--open" : "--closed"
                }`}
              >
                <div className="dropdown-pill --left">
                  <div>
                    <div onClick={() => this.toggleDropdownState()}>
                      <Link
                        to={
                          window.location.pathname !== constants.PATH_ROOT
                            ? constants.PATH_ROOT
                            : constants.PATH_HELP
                        }
                      >
                        <div className="filled-icon">
                          {window.location.pathname !== constants.PATH_ROOT ? (
                            <>
                              <i className="fas fa-home"></i>
                            </>
                          ) : (
                            <>
                              <i className="fas fa-question"></i>
                            </>
                          )}
                        </div>
                      </Link>
                    </div>
                    {window.location.pathname === constants.PATH_ROOT &&
                      !!this.props.web3 && (
                        <Link
                          onClick={() => this.toggleDropdownState()}
                          to={constants.PATH_LEADERBOARD}
                        >
                          <div className="element-in-row filled-icon">
                            <LeaderIcon />
                          </div>
                        </Link>
                      )}
                    <input
                      onClick={() => {
                        this.toggleDarkMode();
                      }}
                      className="element-in-row toggle --small"
                      type="checkbox"
                    />
                  </div>
                </div>

                <div className="single-dropdown">
                  <p onClick={() => this.setActiveTab(1)}>
                    <i className="fas fa-globe-americas"></i>
                    <span>{strings.Languages}</span>
                  </p>
                  <div className={this.getDDClassName(1)}>
                    {Object.keys(LANGUAGES_MAP).map((languageString, index) => (
                      <div
                        key={index}
                        onClick={(e) => {
                          this.changeLanguage(e, languageString);
                        }}
                        className="dropdown-pill"
                      >
                        <a href="/">{LANGUAGES_MAP[languageString]}</a>
                      </div>
                    ))}
                    <div className="dropdown-pill">
                      <a
                        className="contr"
                        href="https://github.com/openzeppelin/ethernaut#modify-or-add-new-languages"
                      >
                        {strings.contributeTranslation}
                      </a>
                    </div>
                  </div>
                </div>
              </ul>
              {/* dropdown content */}
            </div>
          </header>
          <ProgressBar
            height="100"
            width="100"
            borderColor={
              this.state.dark
                ? getComputedStyle(document.documentElement).getPropertyValue(
                    "--pink"
                  )
                : getComputedStyle(document.documentElement).getPropertyValue(
                    "--black"
                  )
            }
            barColor={
              this.state.dark
                ? getComputedStyle(document.documentElement).getPropertyValue(
                    "--pink"
                  )
                : getComputedStyle(document.documentElement).getPropertyValue(
                    "--black"
                  )
            }
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass="progress-bar-wrapper"
            visible={true}
          />
          {!this.props.web3 && (
            <div
              style={{ backgroundColor: "#eddfd6", border: "none" }}
              className="alert alert-warning"
            >
              <strong>{strings.warning}! </strong>
              <span>{strings.warningMessage}</span>
            </div>
          )}
        </center>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    web3: state.network.web3,
    allLevelsCompleted: state.player.allLevelsCompleted,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setLang: actions.setLang,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(onClickOutside(Header))
);
