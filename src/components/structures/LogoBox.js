/*
Copyright 2015, 2016 OpenMarket Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

var React = require('react');
import { _t } from 'matrix-react-sdk/lib/languageHandler';
var sdk = require('matrix-react-sdk')
var dis = require('matrix-react-sdk/lib/dispatcher');
var rate_limited_func = require('matrix-react-sdk/lib/ratelimitedfunc');
var AccessibleButton = require('matrix-react-sdk/lib/components/views/elements/AccessibleButton');

module.exports = React.createClass({
    displayName: 'LogoBox',

    propTypes: {
        collapsed: React.PropTypes.bool,
        onLogo: React.PropTypes.func,
    },

    getInitialState: function() {
        return {
            LogoTerm: "",
        };
    },

    componentDidMount: function() {
        this.dispatcherRef = dis.register(this.onAction);
    },

    componentWillUnmount: function() {
        dis.unregister(this.dispatcherRef);
    },

    onAction: function(payload) {
        // Disabling this as I find it really really annoying, and was used to the
        // previous behaviour - see https://github.com/vector-im/riot-web/issues/3348
/*
        switch (payload.action) {
            // Clear up the text field when a room is selected.
            case 'view_room':
                if (this.refs.Logo) {
                    this._clearLogo();
                }
                break;
        }
*/
    },

    onChange: function() {
        if (!this.refs.Logo) return;
        this.setState({ LogoTerm: this.refs.Logo.value });
        this.onLogo();
    },

    onLogo: new rate_limited_func(
        function() {
            this.props.onLogo(this.refs.Logo.value);
        },
        100
    ),

    onToggleCollapse: function(show) {
        if (show) {
            dis.dispatch({
                action: 'show_left_panel',
            });
        }
        else {
            dis.dispatch({
                action: 'hide_left_panel',
            });
        }
    },

    _clearLogo: function() {
        this.refs.Logo.value = "";
        this.onChange();
    },

    render: function() {
        var TintableSvg = sdk.getComponent('elements.TintableSvg');

        var collapseTabIndex = this.refs.Logo && this.refs.Logo.value !== "" ? "-1" : "0";

        var toggleCollapse;
        if (this.props.collapsed) {
            toggleCollapse =
                <AccessibleButton className="mx_LogoBox_maximise" tabIndex={collapseTabIndex} onClick={ this.onToggleCollapse.bind(this, true) }>
                    <TintableSvg src="img/maximise.svg" width="10" height="16" alt={ _t("Expand panel") }/>
                </AccessibleButton>
        }
        else {
            toggleCollapse =
                <AccessibleButton className="mx_LogoBox_minimise" tabIndex={collapseTabIndex} onClick={ this.onToggleCollapse.bind(this, false) }>
                    <TintableSvg src="img/minimise.svg" width="10" height="16" alt={ _t("Collapse panel") }/>
                </AccessibleButton>
        }

        var LogoControls;
        if (!this.props.collapsed) {
            LogoControls = [
                    this.state.LogoTerm.length > 0 ?
                    <AccessibleButton key="button"
                            className="mx_LogoBox_closeButton"
                            onClick={ ()=>{ this._clearLogo(); } }>
                        <TintableSvg
                            className="mx_LogoBox_LogoButton"
                            src="img/icons-close.svg" width="24" height="24"
                        />
                    </AccessibleButton>
                    :
                    <TintableSvg
                        key="button"
                        className="mx_LogoBox_LogoButton"
                        src="" width="13" height="13"
                    />,
                    <input
                        key="Logofield"
                        type="text"
                        ref="Logo"
                        className="mx_LogoBox_Logo"
                        value={ this.state.LogoTerm }
                        onChange={ this.onChange }
                        placeholder={ _t('Filter room names') }
                    />
                ];
        }

        var self = this;
        return (
            <div className="mx_LogoBox">
            { toggleCollapse }
            <div>Logo Box</div>
            </div>
        );
    }
});
