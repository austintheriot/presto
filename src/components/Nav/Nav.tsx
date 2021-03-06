import React from 'react';
import styles from './Nav.module.scss';
import { Link } from 'react-router-dom';

//images:
import posts from 'assets/images/posts.svg';
import profile from 'assets/images/profile.svg';
import settings from 'assets/images/settings.svg';

export default () => {
	return (
		<>
			<nav className={styles.nav}>
				<ul className={styles.ul}>
					<li className={styles.li}>
						<Link to='/posts'>
							<button className={styles.button} data-info='Posts'>
								<img className={styles.img} src={posts} alt='posts' />
							</button>
						</Link>
					</li>
					<li className={styles.li}>
						<Link to='/profile'>
							<button className={styles.button} data-info='Profile'>
								<img className={styles.img} src={profile} alt='profile' />
							</button>
						</Link>
					</li>
					<li className={styles.li}>
						<Link to='/settings'>
							<button className={styles.button} data-info='Settings'>
								<img className={styles.img} src={settings} alt='settings' />
							</button>
						</Link>
					</li>
				</ul>
			</nav>
		</>
	);
};
