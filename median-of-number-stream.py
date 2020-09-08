from queue import PriorityQueue

class MedianOfAStream:
  # left side of range of numbers stored as max heap
  # right side of range of numbers stored as a min heap
  minHeap = PriorityQueue()
  maxHeap = PriorityQueue()

  def insert_num(self, num: int) -> None:
    if self.maxHeap.qsize() == 0 and  self.minHeap.qsize() == 0:
      self.maxHeap.put(-num)
    elif -self.maxHeap.queue[0] >= num:
      self.maxHeap.put(-num)
    else:
      self.minHeap.put(num)

    self.rebalance()

  def rebalance(self):
    if self.maxHeap.qsize() - self.minHeap.qsize() > 1:
      temp = -self.maxHeap.get()
      self.minHeap.put(temp)
    elif self.minHeap.qsize() - self.maxHeap.qsize() > 1:
      temp = self.minHeap.get()
      self.maxHeap.put(-temp)

  def find_median(self) -> float:
    print(self.maxHeap.queue, self.minHeap.queue)
    if self.maxHeap.qsize() == 0 and  self.minHeap.qsize() == 0:
      return 0
    elif self.maxHeap.qsize() == self.minHeap.qsize():
      return (-self.maxHeap.queue[0] + self.minHeap.queue[0]) / 2
    else:
      if self.maxHeap.qsize() > self.minHeap.qsize():
        return -self.maxHeap.queue[0]
      else:
        return self.minHeap.queue[0]

def main():
  median = MedianOfAStream()
  median.insert_num(3)
  median.insert_num(1)

  print(median.find_median())

  median.insert_num(5)

  print(median.find_median())

  median.insert_num(4)

  print(median.find_median())

main()