export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      const options = { hour12: true, hour: 'numeric', minute: 'numeric' };
      const time = date.toLocaleTimeString('en-US', options);
      return `Today at ${time}`;
    } else {
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
  };