import React from "react";
import {useParams} from "react-router-dom";

import "../styles/profile.css";
import CustomAppBar from "../components/AppBar";
import ProfileUnsub from "../components/ProfileUnsub";
import ProfileOffline from "../components/ProfileOffline";
import ProfileSelf from "../components/ProfileSelf";
import ProfileSub from "../components/ProfileSub";
import SidePanel from "../components/SidePanel";
import {Grid} from "@mui/material";
import LoadingPage from "./LoadingPage";
import ProfileNotFound from "../components/ProfileNotFound";

export default function ProfilePage() {
  const {username} = useParams();

  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/p2p/profiles/" + username)
      .then((res) => res.json())
      .then((res) => {
        setData({
          status: res.message.message,
          record: res.message.content,
        });
      });
  }, []);

  if (!data) {
    return <LoadingPage/>;
  }

  switch (data.status) {
    case "ERR_NOT_FOUND":
      return (
        <div className="ProfilePage">
          <CustomAppBar/>
          <Grid container>
            <Grid item p={4} xs={4}>
              <SidePanel/>
            </Grid>
            <Grid p={4} item xs={8}>
              <ProfileNotFound username={username}/>
            </Grid>
          </Grid>
        </div>
      )
    case "ERR_SELF":
      data.record.posts = data.record.posts.sort((a, b) => b.timestamp - a.timestamp);

      return (
        <div className="ProfilePage">
          <CustomAppBar/>
          <Grid container>
            <Grid item p={4} xs={4}>
              <SidePanel/>
            </Grid>
            <Grid p={4} item xs={8}>
              <ProfileSelf username={username} data={data}/>
            </Grid>
          </Grid>
        </div>
      );
    case "ERR_NOT_SUBSCRIBED":
      return (
        <div className="ProfilePage">
          <CustomAppBar/>
          <Grid container>
            <Grid item p={4} xs={4}>
              <SidePanel/>
            </Grid>
            <Grid p={4} item xs={8}>
              <ProfileUnsub username={username}/>
            </Grid>
          </Grid>
        </div>
      );
    case "ERR_NO_INFO":
      return (
        <div className="ProfilePage">
          <CustomAppBar/>
          <Grid container>
            <Grid item p={4} xs={4}>
              <SidePanel/>
            </Grid>
            <Grid p={4} item xs={8}>
              <ProfileOffline username={username}/>
            </Grid>
          </Grid>
        </div>
      );
    case "OK":
      data.record.posts = data.record.posts.sort((a, b) => b.timestamp - a.timestamp);

      return (
        <div className="ProfilePage">
          <CustomAppBar/>
          <Grid container>
            <Grid item p={4} xs={4}>
              <SidePanel/>
            </Grid>
            <Grid p={4} item xs={8}>
              <ProfileSub username={username} data={data}/>
            </Grid>
          </Grid>
        </div>
      );
    default:
      return <h1>ERROR</h1>;
  }
}
