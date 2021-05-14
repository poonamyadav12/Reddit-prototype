import React, { Component } from 'react'
import { Route } from "react-router-dom"
import Navbar from './navbar/navbar'

import CreatePost from './posts/createPost';
import CreateCommunity from './community/CreateCommunity'
import MyCommunity from './community/MyCommunity'
import MyCommunities from './communities/myCommunities'

import Profile from './users/profile'
import { Profiler } from 'react';
import CommunityModeration from './communities/communityModeration';

import MyCommunityAnalytics from './community/MyCommunityAnalytics';
import Notification from './users/Notification';


import UserProfilePage from './users/user-profile';
import CommunitySearch from './community/CommunitySearch';
import logout from './users/logout';
import Dashboard from './users/Dashboard';
import Chat from './users/Chat';
import Invitations from './users/Invitations';


class Routes extends Component {
    render() {
        return (
            <div>
                <Route exact path="/" component={Navbar} />
                <Route exact path="/dashboard" component={Dashboard} />

                <Route exact path="/submit/:id" component={CreatePost} />
                <Route exact path="/create-community" component={CreateCommunity} />
                <Route exact path="/community-home-page" component={MyCommunity} />
                <Route exact path="/create-community/:id" component={CreateCommunity} />
                <Route exact path="/users/profile-page" component={UserProfilePage} />
                <Route exact path="/search-community" component={CommunitySearch} />
                <Route exact path="/logout" component={logout} />

                <Route exact path="/chat" component={Chat} />

                <Route exact path="/profile" component={Profile} />
                <Route exact path="/my-communities" component={MyCommunities} />
                <Route exact path="/my-communities-mod" component={CommunityModeration} />

                <Route exact path="/my-community-analytics" component={MyCommunityAnalytics} />
                <Route exact path="/my-notifications" component={Notification} />
                <Route path="/invitations" component={Invitations} />

            </div>
        )
    }
}
export default Routes;