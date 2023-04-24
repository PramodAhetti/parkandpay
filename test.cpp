#include <iostream>
#include<vector>
using namespace std;
class Solution {
public:
    int count=0;
    int travel(vector<vector<int>> & memo,vector<vector<int>> & grid,int i,int j){ 
    count++;
    if(memo[i][j]!=0){
      return memo[i][j];
    }
        int ans=grid[i][j];
        if(i==(grid.size()-1) and j==(grid[0].size()-1)){
          return ans;
        }
        ans=2147483647;
        if(i<(grid.size()-1)){
          ans=min(ans,travel(memo,grid,i+1,j));
        }
        if(j<(grid[0].size()-1)){
          ans=min(ans,travel(memo,grid,i,j+1));
        }
        ans+=grid[i][j];
        memo[i][j]=ans;
        return ans;
    }
    int minPathSum(vector<vector<int>>& grid) {
        vector<vector<int>> memo;
        for(int i=0;i<grid.size();i++){
          vector<int> temp;
          for(int j=0;j<grid[0].size();j++){
            temp.push_back(0);
          }
          memo.push_back(temp);
        }
        return travel(memo,grid,0,0);
    }
};
int main(){
    vector<vector<int>> grid;
    int k,j;cin>>k>>j;
    for(int i=0;i<k;i++){
           vector<int> tem;
           for(int m=0;m<j;m++){
                  int temp;
                  cin>>temp;
                  tem.push_back(temp);
           }
           grid.push_back(tem);
    }
    Solution s;
    cout<<s.minPathSum(grid)<<endl;
    cout<<s.count;
    
    return 0;
}