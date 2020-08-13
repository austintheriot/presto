import { TimestampType as ImportedTimestampType } from './config';
import { User } from 'firebase';

export interface InputType {
	label: string;
	value: string;
	animateUp: boolean;
	empty: boolean;
	touched: boolean;
	message: {
		error: boolean;
		text: string;
		default: string;
	};
	suggestions: {
		loading: boolean;
		show: boolean;
		array: string[];
	};
}

export interface CommentType {
	activity?: string;
	body?: string;
	createdAt?: TimestampType;
	name?: string;
	profilePic?: string;
	uid?: string;
}

interface UserAuthenticated extends User {
	authenticated?: boolean;
}

export type UserAuthenticationInfoType = UserAuthenticated | null;

export interface ProfileType {
	uid?: string;
	profilePic?: string;
	activity?: string;
	bio?: string;
	city?: string;
	country?: string;
	county?: string;
	instrument?: string;
	name?: string;
	state?: string;
	type?: string;
	website?: string;
	zip?: string;
	createdAt?: TimestampType;
}

export interface PostType {
	id?: string;
	activity?: string;
	body?: string;
	city?: string;
	comments?: CommentType[];
	country?: string;
	county?: string;
	createdAt?: TimestampType;
	likes?: string[];
	name?: string;
	profilePic?: string;
	state?: string;
	uid?: string;
	zip?: string;
}

export interface HistoryType {
	history?: {
		location?: {
			state?: {
				infoMessage?: string;
				redirect?: string;
			};
		};
	};
}

export type TimestampType = ImportedTimestampType;
