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

  export const onlyDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
  
    if (date.toDateString() === today.toDateString()) {
      return `Today`;
    } else {
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
  };

  
export const toSentenceCase = (text) => {
    if (!text || typeof text !== 'string') return '';
    
    text = text.trim();
  
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  export const formatTime = (time24) => {
    if (!time24 || typeof time24 !== 'string') {
      throw new Error('Invalid time format. Please provide a valid 24-hour time string.');
    }
  
    const [hours, minutes] = time24.split(':').map(Number);
  
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error('Invalid time format. Please ensure it is a valid 24-hour time string.');
    }
  
    const period = hours < 12 ? 'am' : 'pm';
  
    const hours12 = hours % 12 || 12;
  
    return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
  };

