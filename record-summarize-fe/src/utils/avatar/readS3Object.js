export default function readS3Object(url) {
    return `https://${'hd-wallet'}.s3.amazonaws.com/` + url;
}