import React, { Component } from "react";
import { injectIntl } from "react-intl";
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Button,
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { setContainerClassnames } from "../../redux/actions";
import { MenuIcon } from "../../components/svg";
import { useContracts } from "../../hooks";
import { formatAbbreviated, truncate } from "../../utils/formatting";

export const networks = [
  { id: "bsc", name: "BSC MAINNET", direction: "ltr" },
  { id: "eth", name: "ETH MAINNET", direction: "ltr" },
  { id: "polygon", name: "POLYGON MAINNET", direction: "rtl" },
];

const { useState } = require("react");

const TopNav = (props) => {
  const [network, setNetwork] = useState(networks[0]);
  const [connectName, setConnectName] = useState("CONNECT");
  const { user, rsunBalance, connecting, connectWallet, isWrongNetwork } = useContracts();
  
  const menuButtonClick = (e, menuClickCount, containerClassnames) => {
    e.preventDefault();
    setTimeout(() => {
      var event = document.createEvent("HTMLEvents");
      event.initEvent("resize", false, false);
      window.dispatchEvent(event);
    }, 350);
    props.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      props.selectedMenuHasSubItems
    );
  };


  const getButtonText = () => {
    if (isWrongNetwork) {
      return `WRONG NETWORK`;
    }
    if (!connecting && user) {
      if (rsunBalance) {
        return `${formatAbbreviated(rsunBalance, 2)} RSUN | ${truncate(
          user,
          6
        )}`;
      }
      return `${truncate(user, 6)}`;
    }
    if (connecting) {
      return `CONNECTING...`;
    }
    return `CONNECT`;
  };

  const { containerClassnames, menuClickCount } = props;
  return (
    <nav className="navbar fixed-top">
      <div className="d-flex align-items-center navbar-left">
        <NavLink
          to="#"
          className="menu-button d-none d-md-block"
          onClick={(e) =>
            menuButtonClick(e, menuClickCount, containerClassnames)
          }
        >
          <MenuIcon />
        </NavLink>
      </div>
      <div className="navbar-right">
        <div className="d-inline-block">
          <UncontrolledDropdown className="mr-3">
            <DropdownToggle
              caret
              color="light"
              size="sm"
              className="language-button"
            >
              <span className="name">{network.name.toUpperCase()}</span>
            </DropdownToggle>
            <DropdownMenu className="mt-3" right>
              {networks.map((l, index) => {
                return (
                  <DropdownItem
                    onClick={() => {
                      setNetwork(networks[index]);
                    }}
                    key={l.id}
                  >
                    {l.name}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        <Button
          color="primary"
          size="sm"
          className="mr-5"
          onClick={() => {
            connectWallet();
          }}
        >
          {getButtonText()}
        </Button>
      </div>
    </nav>
  );
};

const mapStateToProps = ({ menu, settings }) => {
  const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu;
  return {
    containerClassnames,
    menuClickCount,
    selectedMenuHasSubItems,
  };
};
export default injectIntl(
  connect(mapStateToProps, {
    setContainerClassnames,
  })(TopNav)
);
