﻿using Models.ViewModel;

namespace Services.Interfaces
{
    public interface IClientService
    {
        Task CreateClient(CreateClientViewModel clientViewModel);
        Task DeleteClient(Guid id);
        Task<ReadDetailsClientViewModel> GetClient(Guid id);
        Task<List<ReadAllClientViewModel>> GetAllClient();
        Task ChangeStatus(Guid id);
    }
}
