import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import TopNavNew from "../containers/navs/TopnavNew";
import Sidebar from "../containers/navs/Sidebar";

class AppLayout extends Component {
  render() {
    const { containerClassnames } = this.props;
    return (
      <div id="app-container" className={containerClassnames}>
        <TopNavNew />
        {/* <Sidebar /> */}
        {/* <main>
          <div className="container-fluid">{this.props.children}</div>
        </main> */}
      </div>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};
const mapActionToProps = {};

export default withRouter(
  connect(mapStateToProps, mapActionToProps)(AppLayout)
);
