import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
// import queryString from 'query-string';

const myStorage = window.localStorage;

const Main = (props) => {
	const [url, setUrl] = useState('');
	const [currentUrl, setCurrentUrl] = useState([]);
	const [currentUser, setCurrentUser] = useState(null);

	const fetchData = (url) => {
		fetch(
			'https://api.pics.ee/v1/links?access_token=20f07f91f3303b2f66ab6f61698d977d69b83d64&caller=client-simple&lang=zh-tw',
			{
				body: JSON.stringify({
					url: url,
				}),
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				mode: 'cors',
			}
		)
			.then((res) => res.json())
			.then((data) => {
				let user;
				user =
					currentUser === null || currentUser === 'admin' ? 'all' : currentUser;
				const currentUrls = myStorage.getItem(user);
				const parsedArr = JSON.parse(currentUrls);
				const preparedData = {
					origin_url: url,
					shortened_url: data.data.picseeUrl,
				};
				parsedArr.push(preparedData);
				myStorage.setItem(user, JSON.stringify(parsedArr));
				setCurrentUrl([...currentUrl, preparedData]);
			});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		fetchData(url, currentUser);
		setUrl('');
	};

	// make sure localStorage base is there
	useEffect(() => {
		if (myStorage.getItem('all') === null) {
			myStorage.setItem('all', JSON.stringify([]));
		}
		const query = new URLSearchParams(props.location.search);
		const user = query.get('feature');
		setCurrentUser(user);
	}, []);

	useEffect(() => {
		if (currentUser === 'admin' || currentUser === null) {
			let currentUrls = JSON.parse(myStorage.getItem('all'));
			setCurrentUrl(currentUrls);
		} else {
			if (myStorage.getItem(currentUser) === null) {
				myStorage.setItem(currentUser, JSON.stringify([]));
			} else {
				let currentUrls = JSON.parse(myStorage.getItem(currentUser));
				setCurrentUrl(currentUrls);
			}
		}
	}, [currentUser]);

	return (
		<>
			<form>
				<input name="feature" />
				<button type="submit">使用者登入</button>
			</form>
			<form onSubmit={handleSubmit}>
				<label htmlFor="url">請輸入網址:</label>
				<input value={url} onChange={(e) => setUrl(e.target.value)} id="url" />
				<button type="submit">產生短網址</button>
			</form>
			<ul>
				{currentUrl.map((url) => (
					<li key={url.shortened_url}>
						<span>{url.origin_url} &rarr; </span>
						<a href={url.shortened_url}>{url.shortened_url}</a>
					</li>
				))}
			</ul>
		</>
	);
};

export default withRouter(Main);
