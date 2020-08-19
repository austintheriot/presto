import React from 'react';
import styles from './Post.module.scss';
import { Link } from 'react-router-dom';
import { PostType } from '../../app/types';
import { db } from '../../app/config';

import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../app/userSlice';
import { likePost, unlikePost } from '../../app/postsActionCreators';

//images
import heartEmpty from '../../assets/images/heartEmpty.svg';
import heartFull from '../../assets/images/heartFull.svg';
import commentEmpty from '../../assets/images/commentEmpty.svg';
import commentFull from '../../assets/images/commentFull.svg';

export default ({
	id,
	status,
	error,
	activity,
	body,
	city,
	comments,
	country,
	county,
	createdAt,
	likes,
	name,
	profilePic = 'https://images.pexels.com/photos/922376/pexels-photo-922376.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
	state,
	uid,
	zip,
}: PostType) => {
	const dispatch = useDispatch();
	const user = useSelector(selectUser);

	const likePostHandler = (postId: string) => {
		let userId = user.uid;
		dispatch(likePost(userId, postId));
		//create document if it doesn't exists, or update it if it does
		console.log('[Post]: Liking post. Post Id: ', postId, 'UserId: ', userId);
		//set: creates or updates document with info:
		db.collection('posts')
			.doc(postId)
			.collection('likes')
			.doc(userId)
			.set({
				uid: userId,
			})
			.then(() => {
				console.log('[Post]: Like successfully added to database!');
			})
			.catch((err) => {
				console.error(err);
				dispatch(unlikePost(userId, postId)); //undo action
			});
	};

	const unlikePostHandler = (postId: string) => {
		let userId = user.uid;
		dispatch(unlikePost(userId, postId));
		//delete document if it exists
		console.log('[Post]: Liking post. Post Id: ', postId, 'UserId: ', userId);
		db.collection('posts')
			.doc(postId)
			.collection('likes')
			.doc(userId)
			.delete()
			.then(() => {
				console.log('[Post]: Like successfully deleted from database!');
			})
			.catch((err) => {
				console.error(err);
				dispatch(likePost(userId, postId)); //undo action
			});
	};

	let isSinglePostPage = !!window.location.pathname.split('/posts/')[1];
	let bodyText =
		//if single post, show only body, no link
		isSinglePostPage ? (
			<p>{body}</p>
		) : //if Posts page and body is > 250 characters, truncate
		body && body.length > 250 ? (
			<>
				<p>{body.substr(0, 250) + '...'}</p>
				<Link to={`/posts/${id}`} className={styles.SeeMore}>
					See More
				</Link>
			</>
		) : (
			//Else if Posts page and body is <= 250 characters, show it plain with a link to individual post
			<Link to={`/posts/${id}`} className={styles.Link}>
				<p>{body}</p>
			</Link>
		);
	return (
		<>
			{status === 'idle' ? null : status === 'loading' ? (
				<div className={styles.altWrapper}>
					<p>Loading post...</p>
				</div>
			) : status === 'failed' ? (
				<div className={styles.altWrapper}>
					<p>Post not found.</p>
				</div>
			) : status === 'success' ? (
				<div className={styles.wrapper}>
					<article className={styles.article}>
						<header>
							{/* PROFILE PIC*/}
							<div className={styles.profilePic}>
								<Link to={`/profile/${uid}`} className={styles.Link}>
									<img alt='/profile' src={profilePic} />
								</Link>
							</div>
							{/* NAME */}
							<Link to={`/profile/${uid}`} className={styles.Link}>
								<h2 className={styles.name}>{name}</h2>
							</Link>
							{/* TIME */}
							<Link
								to={`/posts/${id}`}
								className={[styles.Link, styles.timeLink].join(' ')}>
								<time>{createdAt}</time>
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
						<main className={styles.body}>{bodyText}</main>
						<footer>
							{/* NUMBER OF LIKES */}
							<Link to={`/posts/${id}`} className={styles.Link}>
								<p className={styles.likes}>
									<img alt='likes' src={heartFull}></img> {likes!.count} likes
								</p>
							</Link>
							{/* NUMBER OF COMMENTS */}
							<Link
								to={`/posts/${id}`}
								className={[styles.Link, styles.comments].join(' ')}>
								<img alt='likes' src={commentFull}></img> {comments!.count}{' '}
								comments
							</Link>
							<div className={styles.icons}>
								{/* LIKE BUTTON */}
								<button>
									{/* Show full heart if this post has been saved in user "likes" */}
									{likes[user.uid] ? (
										<img
											alt='likes'
											src={heartFull}
											onClick={() => unlikePostHandler(id!)}></img>
									) : (
										<img
											alt='likes'
											src={heartEmpty}
											onClick={() => likePostHandler(id!)}></img>
									)}
								</button>

								{/* COMMENT BUTTON */}
								{Object.values(comments).find(
									(comment: any) => comment.uid === user.uid
								) ? (
									<Link to={`/posts/${id}`} className={styles.Link}>
										<button>
											<img alt='comments' src={commentFull}></img>
										</button>
									</Link>
								) : (
									<Link to={`/posts/${id}`} className={styles.Link}>
										<button>
											<img alt='comments' src={commentEmpty}></img>
										</button>
									</Link>
								)}
							</div>
						</footer>
					</article>
				</div>
			) : null}
		</>
	);
};
