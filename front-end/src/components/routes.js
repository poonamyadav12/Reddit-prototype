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
import Dashboard from './users/dashboard';


class Routes extends Component {
    render() {
        return (
            <div>
                <Route exact path="/" component={Navbar} />
                <Route path="/dashboard" component={Dashboard} />

                <Route path="/submit/:id" component={CreatePost} />
                <Route exact path="/create-community" component={CreateCommunity} />
                <Route path="/community-home-page" component={MyCommunity} />
                <Route exact path="/create-community/:id" component={CreateCommunity} />
                <Route path="/users/profile-page" component={UserProfilePage} />
                <Route path="/search-community" component={CommunitySearch} />
                <Route path="/logout" component={logout} />

                <Route path="/profile" component={Profile} />
                <Route path="/my-communities" component={MyCommunities} />
                <Route path="/my-communities-mod" component={CommunityModeration} />

                <Route path="/my-community-analytics" component={MyCommunityAnalytics} />
                <Route path="/my-notifications" component={Notification} />

            </div>
        )
    }
}
export default Routes;