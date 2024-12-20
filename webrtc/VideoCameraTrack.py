import asyncio
from aiortc import MediaStreamTrack
from av import VideoFrame
import cv2
from fractions import Fraction

class VideoCameraTrack(MediaStreamTrack):
    """
    A video stream track that transforms frames from an another track.
    """

    kind = "video"

    def __init__(self, video_src):
        super().__init__()  # don't forget this!

        self.cap = cv2.VideoCapture(video_src)
        self.time_base = Fraction(1, 30)

    async def recv(self):
        await asyncio.sleep(1 / 30)

        ret, frame = self.cap.read()
        if not ret:
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  # Restart the video
            ret, frame = self.cap.read()

        if not ret:
            raise Exception("Unable to read video frame!")

        # convert the frame for WebRTC
        video_frame = VideoFrame.from_ndarray(frame, format="bgr24")
        video_frame.pts, video_frame.time_base = self.time_base, Fraction(1, 30)
        return video_frame
