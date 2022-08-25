import { Handler } from '@netlify/functions';
import { getSpotifyPlaylist } from '../../utils/get-spotify-playlist';
import { getSpotifyToken } from '../../utils/get-spotify-token';
import { generateSVGBuffer } from './generate-svg-buffer';

async function getPlaylistName(playlistId) {
	const authToken = await getSpotifyToken();
	console.log(authToken);
	const playlist = await getSpotifyPlaylist(playlistId, authToken.access_token);
	console.log(playlist);
	return playlist.name;
}

export const handler: Handler = async (event, context) => {
	const playlistId = event.queryStringParameters!['playlist-id'];
	console.log(playlistId);
	const playlistName = playlistId;
	// try {
	// 	playlistName = await getPlaylistName(playlistId);
	// } catch {
	// 	console.log(playlistId);
	// }

	console.log(playlistId);
	console.log(playlistName);

	const buffer = await generateSVGBuffer(playlistName);

	const response = {
		statusCode: 200,
		headers: {
			'Content-Type': 'image/png',
			'Access-Control-Allow-Origin': '*', // Allow from anywhere
			'Cache-Control': 'public, immutable, no-transform, s-maxage=31536000, max-age=31536000'
		},
		body: buffer.toString('base64'),
		isBase64Encoded: true
	};
	return response;
};
