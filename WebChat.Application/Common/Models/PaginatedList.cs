namespace WebChat.Application.Common.Models;

/// <summary>
/// Mô hình lưu trữ phân trang
/// </summary>
/// <typeparam name="T">Kiểu dữ liệu của phần tử</typeparam>
public class PaginatedList<T>
{
    #region Properties
    /// <summary>
    /// Dữ liệu của page
    /// </summary>
    public IReadOnlyList<T> Items { get; }

    /// <summary>
    /// Trang hiện tại
    /// </summary>
    public int PageNumber { get; }

    /// <summary>
    /// Số phần tử trong trang
    /// </summary>
    public int PageSize { get; }

    /// <summary>
    /// Tổng số trang
    /// </summary>
    public int TotalPages { get; }

    /// <summary>
    /// Tổng số bản ghi
    /// </summary>
    public int TotalCount { get; }
    #endregion

    #region Constructors
    /// <summary>
    /// Tạo một phân trang
    /// </summary>
    /// <param name="items">Các phần tử của trang</param>
    /// <param name="count">Số lượng phần tử của csdl</param>
    /// <param name="pageNumber">Trang hiện tại</param>
    /// <param name="pageSize">Số phần tử tối đa trong một trang</param>
    public PaginatedList(IReadOnlyList<T> items, int count, int pageNumber, int pageSize)
    {
        PageNumber = pageNumber;
        PageSize = pageSize;
        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        TotalCount = count;
        Items = items;
    }
    #endregion

    #region Methods
    /// <summary>
    /// Kiểm tra có trang trước đó không
    /// </summary>
    public bool HasPreviousPage() => PageNumber > 1;

    /// <summary>
    /// Kiểm tra có trang sau không
    /// </summary>
    public bool HasNextPage() => PageNumber < TotalPages;
    #endregion
}
