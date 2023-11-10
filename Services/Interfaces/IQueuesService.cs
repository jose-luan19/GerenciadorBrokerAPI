﻿using Models;
using Models.ViewModel;

namespace Services.Interfaces
{
    public interface IQueueService
    {
        Task<Queues> CreateQueue(CreateQueueViewModel Queues);
        Task DeleteQueue(Guid idQueue);
        Task<IEnumerable<Queues>> GetAllQueues();
    }
}