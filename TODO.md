# 해야할 것 정리

## 2019-12-19
- mtg api를 사용하여 get_cards를 할 때 중복되는 경우가 자꾸 나오고 카드의 한글이름이 안나온다(Set을 통해 해결해야할듯? 근데)

## 2019-12-22
- 중복되어 나오는 이름들은 아마도 쇼케이스 카드 같이 여러 이미지가 있는 경우인걸로 보임
- request 보낼때 request별 딜레이가 필요함
- headers.count에 해당 call에 대한 데이터 수를 담고 있음
- Set 은 === 을 통해 중복 체크를 하기 때문에 override 할 방법이 없다는듯?
- Arena에서 쓸 수 있는 Set 구분할 방법 생각해야함