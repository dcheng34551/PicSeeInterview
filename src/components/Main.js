import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import queryString from 'query-string';

const Main = (props) => {
	const [url, setUrl] = useState('');
	const [currentUrl, setCurrentUrl] = useState([]);
	const [query, setQuery] = useState('');

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
				setCurrentUrl([...currentUrl, data.data.picseeUrl]);
			});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		fetchData(url);
		setUrl('');
	};

	// useEffect(() => {
	// 	setQuery(props.location.search);
	// 	console.log(window.localStorage.getItem('all'));
	// }, []);

	useEffect(() => {
		if (window.localStorage.getItem('all') === null) {
			window.localStorage.setItem('all', JSON.stringify([]));
			let data = window.localStorage.getItem('all');
			setCurrentUrl(JSON.parse(data));
		}
	}, []);

	// useEffect(() => {
	// 	if (window.localStorage.getItem('all') === null) {
	// 		window.localStorage.setItem('all', currentUrl);
	// 	} else {
	// 		window.localStorage.setItem('all', currentUrl);
	// 	}
	// }, [currentUrl]);

	// useEffect(() => {
	//   if(query === '?admin') {

	//   }
	// }, [query])

	return (
		<>
			<form onSubmit={handleSubmit}>
				<label htmlFor="url">請輸入網址:</label>
				<input value={url} onChange={(e) => setUrl(e.target.value)} id="url" />
				<button type="submit">產生短網址</button>
			</form>
			<ul>
				{currentUrl.map((url) => (
					<li key={url}>
						<a href={url}>{url}</a>
					</li>
				))}
			</ul>
		</>
	);
};

export default withRouter(Main);
