
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';


interface PaginationComponentProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  isMobile: boolean;
  open: boolean;
  openMobile: boolean;

  onPageChange: (page: number) => void;
  
}

const PaginationComponent = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange ,
   isMobile,
   open,
   openMobile 

}: PaginationComponentProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };
console.log( currentPage, 
  totalItems, 
  itemsPerPage, )


  return (
       <div className={`fixed bottom-0 right-0 z-10 bg-white border-t border-gray-200 p-4 ${
        (isMobile || !open )? "left-0" : "left-60"
      }`}>
    <div className="max-w-4xl mx-auto">
    <Pagination className="">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => onPageChange(currentPage - 1)}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
        
        {getVisiblePages().map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChange(page)}
              isActive={currentPage === page}
              className="cursor-pointer"
              style={currentPage === page ? { 
                backgroundColor: '#C04E2B', 
                color: 'white',
                borderColor: '#C04E2B'
              } : {}}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => onPageChange(currentPage + 1)}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
    </div></div>
  );
};

export default PaginationComponent;
