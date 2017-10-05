import React from 'react'
import appData from '../data/AppData.js'
import classnames from 'classnames'
import ChromeAPI from './Chrome.js'
import _ from 'underscore'

require("./less/history.less");

class History extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        historyGroups: [],
        groupsView: true,
        historyListViewData: []
      }
      this.onHistoryGroupClick = this.onHistoryGroupClick.bind(this);
      this.onBackClick = this.onBackClick.bind(this);
  }

  onHistoryGroupClick(event) {
    let key = event.currentTarget.dataset.key;
    this.setState({
      groupsView: false,
      historyListViewData: {key,data:this.state.historyGroups[key]}
    });
  }

  componentDidUpdate(prevProps, prevState) {
    window.$('.tooltipped').tooltip();
  }

  onBackClick() {
    this.setState({
      historyListViewData: {},
      groupsView: true,
    });
  }

  componentDidMount() {
    var self = this;
    var microsecondsBack = 1000 * 60 * 60 * 24 * 10;//days;
    var startTime = (new Date).getTime() - microsecondsBack;
    var options = {
      text: "",
      startTime,
      maxResults: 2000
    };
    ChromeAPI.getGroups(options,(historyGroups) => {
      self.setState({
        historyGroups: historyGroups
      });
    });
  }

   render() {

      function HistoryGroups (props) {
          if (props.groups.length === 0 ) {
            return (<div>Not Found</div>)
          }

          var historyGroups =  Object.keys(props.groups).map((key,index) => {
              let websiteUrl = props.groups[key].filter((g) => {
                return g.url === 'https://www.'+ key;
              });
              websiteUrl = websiteUrl.length > 0 ? websiteUrl[0].url :  props.groups[key][0].url;
              console.log(websiteUrl);
              return(<div className="col s2" key={index}>
                <div className="card historyCard hoverable" data-key={key} onClick={props.onHistoryGroupClick}>
                  <div className="card-content">
                    <img className="website-icon" src={'chrome://favicon/size/16@2x/'+websiteUrl}></img>
                    <span className="website-name tooltipped" data-position="top" data-delay="50" data-tooltip={key}>{key}</span>
                  </div>
                  <div className="card-action">
                    <a href={"http://www."+key}>Open</a>
                  </div>
                </div>
              </div>);
          });
          return (
            <div>{historyGroups}</div>
          )
      }

      function HistoryListView(props) {
        return (
          <ul className="collection with-header">
            <li className="collection-item avatar">
              <img src={"chrome://favicon/size/16@2x/"+props.data.data[0].url} alt="" className="circle"/>
              <span className="title">{props.data.key}</span>
              <a href={"http://www."+props.data.key} className="secondary-content"><i className="fa fa-globe fa-2x"></i></a>
            </li>

            {
              props.data.data.map((d) =>
                  <li className="collection-item"><a href={d.url}>{d.url}</a></li>
              )
            }
          </ul>
        )
      }

      return (
          <div className="row cardContainer">
            <div className="col s12 runbotTitle appTital">
              History
              <div className="runbotActions right"></div>
              <div className={"back " + classnames({'hide': this.state.groupsView})} onClick={this.onBackClick}><i className="fa fa-arrow-left" aria-hidden="true"></i></div>
            </div>
            {
              this.state.groupsView ? <HistoryGroups groups={this.state.historyGroups} onHistoryGroupClick={this.onHistoryGroupClick}/> :
              <HistoryListView data={this.state.historyListViewData}/>
            }
          </div>
      );
   }
}

export default History;