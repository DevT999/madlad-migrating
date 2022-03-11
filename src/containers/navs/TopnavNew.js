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
import { ethers } from 'ethers';
import { setContainerClassnames } from "../../redux/actions";
import { MenuIcon } from "../../components/svg";
import { useContracts } from "../../hooks";
import { formatAbbreviated, truncate } from "../../utils/formatting";

export const networks = [
  { id: "bsc", name: "BSC MAINNET", direction: "ltr" },
  { id: "eth", name: "ETH MAINNET", direction: "ltr" },
  { id: "polygon", name: "POLYGON MAINNET", direction: "rtl" },
];

const TopNavNew = (props) => {
  const { user, rsunBalance, samurai, samurai_old, SAMURAI_ADR, connecting, connectWallet, isWrongNetwork } =
    useContracts();

  console.log(samurai);

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

  const migrate = async () => {
    let val, allw;
    let callable = false;
    await samurai.balanceOf(user).then(res => {val = ethers.BigNumber.from(res.div(ethers.BigNumber.from(10**15).div(1000))).toNumber()})
    console.log(ethers.BigNumber.from(val).toNumber());
    await samurai_old.allowance(user, SAMURAI_ADR).then(res => {allw = ethers.BigNumber.from(res.div(ethers.BigNumber.from(10**15).div(1000))).toString()})
    console.log('--------------',allw);
    if(allw == "0") {
      try {
        await samurai_old.approve(SAMURAI_ADR, ethers.constants.MaxUint256);
        callable = true
      }
      catch(e) {
        console.log("exception,", e);
      }
    }
    else {
      callable = true;
    }
    console.log(callable);
    if(callable) {
      await samurai.Migrate();
    }
    
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: "url(/assets/img/bg_background.jpg)",
      }}
    >
      <div className="row mt-3" style={{ width: "100%" }}>
        <div style={{ flex: 1 }} />
        <button
          style={{
            width: 180,
            height: 50,
            backgroundColor: "rgb(97, 84, 67)",
            border: "1px solid rgb(127, 111, 86)",
            borderRadius: 4,
            color: "rgb(255, 221, 174)",
            fontSize: 20,
            fontWeight: 300,
          }}
          onClick={() => {
            connectWallet();
          }}
        >
          {getButtonText()}
        </button>
      </div>
      <div
        className="mt-5"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <img style={{ width: 300 }} src="/assets/img/smg-logo.png" />
        <div
          className="mt-3 mb-3"
          style={{
            fontSize: 33,
            fontWeight: "bold",
            color: "rgb(255, 221, 174)",
          }}
        >
          {" "}
          $SMG Migration Dashboard
        </div>
        <div
          style={{
            fontSize: 15,
            maxWidth: 850,
            textAlign: "center",
            color: "#ffffff",
          }}
        >
          Deposit $RSUN or $INF to receive the $SMG token. $SMG will be vested
          over the course of a month after relaunch in late January. The
          migration price was determined on December 29, 2021, 18:00 UTC.
        </div>
        <div
          className="mt-5"
          style={{
            display: "flex",
            flexDirection: "column",
            width: 414,
            height: 313,
            borderRadius: 5,
            border: "1px #806F57 solid",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 71,
              borderBottom: "1px #806F57 solid",
              display: "flex",
              alignItems: "center",
              paddingLeft: 16,
              fontSize: 25,
              color: "rgb(255, 221, 174)",
              fontWeight: 700,
            }}
          >
            Deposit $RSUN
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              style={{
                width: 180,
                height: 50,
                backgroundColor: "rgb(97, 84, 67)",
                border: "1px solid rgb(127, 111, 86)",
                borderRadius: 4,
                color: "rgb(255, 221, 174)",
                fontSize: 20,
                fontWeight: 300,
              }}
              onClick={() => migrate()}
            >
              MIGRATE
            </button>
          </div>
        </div>
      </div>
    </div>
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
  })(TopNavNew)
);
