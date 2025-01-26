export class Helper {
  /**
   * convertTimestamp
   * - Function to convert the timestamp to a readable format
   * 
   * @param createdAt - timestamp of the report
   */
  static convertTimestamp = (createdAt: number) => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - createdAt) / 1000);

    if (diffInSeconds < 60) {
      return diffInSeconds === 1 ? "1 second ago" : `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return diffInMinutes === 1 ? "1 minute ago" : `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  };
}