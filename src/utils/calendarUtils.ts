
export const getServiceColor = (serviceId: string) => {
    // Generate consistent colors based on service ID
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-yellow-500'
    ];
    if (!serviceId) {
      return colors[7]; // default yellow color for unknown service
    }
    const index = serviceId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
};
