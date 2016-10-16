import React, { Component } from 'react';

import connect from '../library/connect';
import setTitle from '../library/setTitle';

import getNews from '../api/news';

import Logo from '../component/Logo';
import DemoButton from '../component/DemoButton';

import i18n from '../i18n';
import * as errorType from '../config/error';
import action from '../action';

let newsIndex = 0;

class Demo extends Component {

    componentDidMount () {
        this.getMoreNews();
    }

    render () {

        setTitle(i18n.SOMEONE_S_HOME('vivaxy'));

        let {
            buttonState,
            newsListState,
        } = this.props;

        return <div>
            <Logo/>
            {newsListState.map((news) => {
                return <div key={`news-${newsIndex++}`}>{news.name}</div>;
            })}
            <DemoButton buttonDisabled={!buttonState} onLoadMore={::this.getMoreNews}/>
        </div>
    }

    async getMoreNews () {
        let {
            appendNewsListAction,
            setButtonDefaultAction,
            setButtonDisabledAction,
            showToastAction,
        } = this.props;
        try {
            setButtonDisabledAction();
            let list = await getNews();
            appendNewsListAction(list);
            setButtonDefaultAction();
        } catch (ex) {
            switch (ex.name) {
                case errorType.FETCH:
                    showToastAction(ex.message);
                    break;
                case errorType.SERVER:
                    showToastAction(ex.message);
                    break;
                default:
                    throw ex;
            }
        }
    }

}

export default connect(state => ({
    buttonState: state.button,
    newsListState: state.newsList,
}), {
    setButtonDisabledAction: action.button.setButtonDisabled,
    setButtonDefaultAction: action.button.setButtonDefault,
    appendNewsListAction: action.newsList.appendNewsList,
})(Demo);
