import React, { useState, useEffect } from 'react';
import styles from './NewPost.module.scss';
import { Link } from 'react-router-dom';
import { UserPayload } from 'app/types';
import { db, serverTimeStamp } from 'app/config';
import Textarea from 'components/Inputs/Textarea';
import Button from 'components/Button/Button';

import { InputType } from 'app/types';

import { useSelector } from 'react-redux';
import { selectUser } from 'app/userSlice';
import noProfilePic from 'assets/images/no-img.svg';
import formatLocation from 'app/formatLocation';
import formatCurrentDate from 'app/formatCurrentDate';

interface Inputs {
	body: InputType;
}

type KeyOfInputs = keyof Inputs;

export default () => {
	const user = useSelector(selectUser);
	const {
		uid = '',
		activity = '',
		profilePic,
		city = '',
		country = '',
		name = '',
		state = '',
		zip = '',
	}: UserPayload = user;

	const [inputs, setInputs] = useState<Inputs>({
		body: {
			label: 'Write a post',
			value: '',
			animateUp: false,
			empty: true,
			edited: false,
			message: {
				error: false,
				text: '',
				default: '',
			},
			suggestions: {
				selected: false,
				loading: false,
				show: false,
				array: [],
			},
		},
	});

	const [currentTime, setCurrentTime] = useState(formatCurrentDate());

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(formatCurrentDate());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const handleFocus = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
		setInputs((prevState: Inputs) => ({
			...prevState,
			[newestType]: {
				...prevState[newestType],
				animateUp: true,
				edited: true,
			},
		}));
	};

	const handleBlur = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
		//animation & output error if empty
		let targetEmpty =
			inputs[newestType].edited && inputs[newestType].value.length === 0
				? true
				: false;
		setInputs((prevState: Inputs) => ({
			...prevState,
			[newestType]: {
				...prevState[newestType],
				//animation
				animateUp: targetEmpty ? false : true,
			},
		}));
	};

	const handleChange = (
		e: React.FormEvent<HTMLInputElement>,
		newestType: KeyOfInputs
	) => {
		let targetValue = e.currentTarget.value;
		let targetEmpty = targetValue.length === 0 ? true : false;

		setInputs((prevState: Inputs) => ({
			...prevState,
			[newestType]: {
				...prevState[newestType],
				//animation
				value: targetValue,
				empty: targetEmpty,
			},
		}));
	};

	const submitHandler = (e: React.SyntheticEvent) => {
		//pre default form submission
		e.preventDefault();

		//if body text has not been edited/edited, ignore submit button
		if (!inputs.body.edited || inputs.body.empty || !inputs.body.value) {
			return;
		}

		//check for errors

		//only update information if new information has been provided
		interface StateAndUserInfo {
			uid: string;
			comments: {
				count: number;
			};
			likes: {
				count: number;
			};
			createdAt: any;

			activity?: string;
			city?: string;
			country?: string;
			name?: string;
			profilePic?: string;
			state?: string;
			zip?: string;

			body?: string;
		}

		let stateAndUserInfo: StateAndUserInfo = {
			uid,
			comments: {
				count: 0,
			},
			likes: {
				count: 0,
			},

			activity,
			city,
			country,
			createdAt: serverTimeStamp(),
			name,
			profilePic,
			state,
			zip,

			body: inputs.body.value,
		};

		setInputs((prevState: Inputs) => ({
			...prevState,
			body: {
				...prevState.body,
				//animation
				value: '',
				empty: true,
				animateUp: false,
			},
		}));

		db.collection('posts')
			.add(stateAndUserInfo)
			.then(() => {
				console.log('Post successfully added to database!');
			})
			.catch((error) => {
				console.error(error);
				alert('Sorry, there was a server error. Please try again later.');
			});
	};

	return (
		<div className={styles.wrapper}>
			<article className={styles.article}>
				<header>
					{/* PROFILE PIC*/}
					<div className={styles.profilePic}>
						<Link to={`/profile/${uid}`} className={styles.Link}>
							<img alt='/profile' src={profilePic || noProfilePic} />
						</Link>
					</div>
					{/* NAME */}
					<Link to={`/profile/${uid}`} className={styles.Link}>
						<h2 className={styles.name}>{name}</h2>
					</Link>
					{/* TIME */}
					<Link
						to={`/profile/${uid}`}
						className={[styles.Link, styles.timeLink].join(' ')}>
						<time>{currentTime}</time>
					</Link>
					{/* LOCATION */}
					<Link to={`/profile/${uid}`} className={styles.locationLink}>
						<address className={styles.location}>
							{formatLocation({ city, state, country })}
						</address>
					</Link>
					{/* ACTIVITY */}
					<Link
						to={`/profile/${uid}`}
						className={[styles.Link, styles.activityLink].join(' ')}>
						<p className={styles.activity}>{activity}</p>
					</Link>
				</header>
				{/* BODY */}
				{/* Only link to individual post when on main feed */}
				<main className={styles.body}>
					<form onSubmit={submitHandler}>
						<Textarea
							customType='body'
							handleFocus={(e: React.FormEvent<HTMLInputElement>) =>
								handleFocus(e, 'body')
							}
							handleBlur={(e: React.FormEvent<HTMLInputElement>) =>
								handleBlur(e, 'body')
							}
							handleChange={(e: React.FormEvent<HTMLInputElement>) =>
								handleChange(e, 'body')
							}
							input={inputs.body}
							setInputs={setInputs}
						/>
						<Button type='submit' onClick={submitHandler}>
							Submit
						</Button>
					</form>
				</main>
			</article>
		</div>
	);
};
